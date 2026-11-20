import React, { useEffect, useState, useRef } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import axios from "axios";
import GuestLayout from "@/Layouts/GuestLayout";

// ── Simple Loader ─────────────────────────────────────────────────────────────
const Loader = ({ className = "py-20" }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="w-10 h-10 border-4 border-gray-200 border-t-[#50644b] rounded-full animate-spin"></div>
  </div>
);

// ── CharacterBox Component ────────────────────────────────────────────────────
// `size` controls the box footprint:
//   'default' – regular boxes (uniform width via widthCh)
//   'large'   – Puṣpikā boxes
//   'citra'   – Citra (figures) boxes — the biggest, so figures are clearly visible
const CharacterBox = ({
  image,
  label,
  link,
  hasData = true,
  size = "default",
  widthCh = null,
}) => {
  const [imgError, setImgError] = useState(false);
  const imageBaseUrl = import.meta.env.VITE_IMAGE_PATH;

  const isCitra = size === "citra";
  const isLarge = size === "large";
  const isFlexible = isCitra || isLarge;

  // Puṣpikā / Citra boxes stay flexible (grow to fit long names).
  // All other boxes share one uniform width (widthCh, computed from the widest
  // label in the group) so every box is the same size while the name still
  // fits on a single line without wrapping or being cut off.
  const useUniform = !isFlexible && widthCh;
  const boxWidth = isCitra
    ? "min-w-[190px] sm:min-w-[250px] w-fit max-w-full"
    : isLarge
      ? "min-w-[160px] sm:min-w-[200px] w-fit"
      : useUniform
        ? ""
        : "w-[120px] sm:w-[140px]";
  const uniformStyle = useUniform ? { width: widthCh, minWidth: widthCh } : undefined;
  const boxMinHeight = isCitra
    ? "min-h-[200px] sm:min-h-[260px]"
    : isLarge
      ? "min-h-[160px] sm:min-h-[200px]"
      : "min-h-[120px] sm:min-h-[140px]";
  const imgBox = isCitra
    ? "w-36 sm:w-48 h-36 sm:h-48"
    : isLarge
      ? "w-24 sm:w-32 h-24 sm:h-32"
      : "w-14 sm:w-16 h-14 sm:h-16";
  const placeholderBox = isCitra
    ? "w-36 sm:w-48 h-36 sm:h-48"
    : isLarge
      ? "w-24 sm:w-32 h-24 sm:h-32"
      : "w-12 sm:w-16 h-12 sm:h-16";
  const labelWrap = isCitra
    ? "break-words"
    : isLarge || useUniform
      ? "whitespace-nowrap"
      : "break-words";
  const labelSize = isCitra ? "text-sm sm:text-base" : "text-xs sm:text-sm";
  const cardPadding = isCitra ? "px-3 py-4 sm:py-5" : "px-2 py-4";

  if (!hasData) {
    // Empty/"in preparation" boxes always keep the original fixed size and
    // wrapped centered text — not the uniform/single-line sizing used for
    // boxes that actually have data.
    const emptyBoxWidth = isFlexible
      ? "w-[160px] sm:w-[200px]"
      : "w-[120px] sm:w-[140px]";
    const emptyBoxMinHeight = isFlexible
      ? "min-h-[160px] sm:min-h-[200px]"
      : "min-h-[120px] sm:min-h-[140px]";
    return (
      <div className={`inline-block border border-black mb-2  ${emptyBoxWidth}`}>
        <div className={`${emptyBoxMinHeight} flex flex-col`}>
          <div className="flex-1 p-3 sm:p-4 text-center">
            <p className="mt-2 text-xs sm:text-sm text-gray-400 break-words">
              {label}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : `${imageBaseUrl}/${image}`
    : null;

  return (
    <div
      className={`inline-block border border-black mb-2 overflow-hidden ${boxWidth}`}
      style={uniformStyle}>
      <div className={`${boxMinHeight} flex flex-col`}>
        <div className={`flex-1 ${cardPadding} text-center`}>
          {imageUrl && !imgError ? (
            <div className={`${imgBox} mx-auto flex items-center justify-center overflow-hidden`}>
              <img
                src={imageUrl}
                className="max-w-full max-h-full w-auto h-auto object-contain"
                alt={label}
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div
              className={`${placeholderBox} mx-auto flex items-center justify-center text-gray-400 text-xs sm:text-sm`}>
              {label}
            </div>
          )}
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer">
              <p
                className={`mt-3 ${labelSize} hover:text-blue-700 px-2 ${labelWrap}`}
                title={label}>
                {label}
              </p>
            </a>
          ) : (
            <p className={`mt-3 ${labelSize} px-2 ${labelWrap}`} title={label}>
              {label}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Helper: uniform width (in ch units) for a group of CharacterBoxes ────────
// Sizes every box in the group to fit the longest label on one line, with a
// sensible floor so short/empty labels don't shrink the box below the default.
const computeUniformWidthCh = (labels, minCh = 14) => {
  const maxLen = labels.reduce(
    (max, l) => Math.max(max, (l || "").length),
    0,
  );
  return `${Math.max(maxLen + 3, minCh)}ch`;
};

// ── Helper: extract trailing number from image_name ──────────────────────────
const extractSuffixNumber = (imageName) => {
  if (!imageName) return null;
  const match = imageName.match(/_(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
};

const sortNumeralItems = (items) =>
  [...items].sort((a, b) => {
    const numA = extractSuffixNumber(a.image_name) ?? Infinity;
    const numB = extractSuffixNumber(b.image_name) ?? Infinity;
    return numA - numB;
  });

// ── NumeralBox Component ──────────────────────────────────────────────────────
const parsePalaeographicalImageName = (imageName) => {
  if (!imageName) return null;

  const match = imageName.match(
    /^INSN(\d+)[A-Za-z](\d+(?:st|nd|rd|th)?)(?=_|\.|$)/i,
  );
  if (!match) return null;

  const inscriptionNumber = parseInt(match[1], 10);
  const dateToken = match[2].toLowerCase();
  const centuryMatch = dateToken.match(/^(\d+)(?:st|nd|rd|th)$/);

  if (centuryMatch) {
    const century = parseInt(centuryMatch[1], 10);
    return {
      inscriptionNumber,
      chronologicalKey: century * 100,
      isCentury: true,
    };
  }

  return {
    inscriptionNumber,
    chronologicalKey: parseInt(dateToken, 10),
    isCentury: false,
  };
};

const sortPalaeographicalItems = (items) =>
  items
    .map((item, index) => ({
      item,
      index,
      parsed: parsePalaeographicalImageName(item.image_name),
    }))
    .sort((a, b) => {
      if (a.parsed && b.parsed) {
        if (a.parsed.chronologicalKey !== b.parsed.chronologicalKey) {
          return a.parsed.chronologicalKey - b.parsed.chronologicalKey;
        }

        if (a.parsed.isCentury !== b.parsed.isCentury) {
          return a.parsed.isCentury ? 1 : -1;
        }

        if (a.parsed.inscriptionNumber !== b.parsed.inscriptionNumber) {
          return a.parsed.inscriptionNumber - b.parsed.inscriptionNumber;
        }

        return a.index - b.index;
      }

      if (a.parsed) return -1;
      if (b.parsed) return 1;

      const aOrder = a.item.order ?? null;
      const bOrder = b.item.order ?? null;
      if (aOrder !== null && bOrder !== null && aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      if (aOrder !== null && bOrder === null) return -1;
      if (aOrder === null && bOrder !== null) return 1;

      return a.index - b.index;
    })
    .map(({ item }) => item);

// `size` controls the box footprint: 'small' (default/other categories),
// 'medium' (Aṅka/numerals — smaller than large, bigger than small), or
// 'large' (Puṣpikā/Citra).
const NumeralBox = ({ item, size = "medium" }) => {
  const [imgError, setImgError] = useState(false);
  const imageBaseUrl = import.meta.env.VITE_IMAGE_PATH;
  const imageUrl = item.image
    ? item.image.startsWith("http")
      ? item.image
      : `${imageBaseUrl}/${item.image}`
    : null;

  const displayNumber = extractSuffixNumber(item.image_name);

  const sizeStyles = {
    small: {
      boxWidth: "min-w-[120px] sm:min-w-[140px]",
      boxMinHeight: "min-h-[120px] sm:min-h-[140px]",
      imgBox: "w-12 sm:w-16 h-12 sm:h-16",
      imgRowHeight: "h-[70px] sm:h-[80px]",
    },
    medium: {
      boxWidth: "min-w-[135px] sm:min-w-[165px]",
      boxMinHeight: "min-h-[135px] sm:min-h-[165px]",
      imgBox: "w-[72px] sm:w-[96px] h-[72px] sm:h-[96px]",
      imgRowHeight: "h-[90px] sm:h-[105px]",
    },
    large: {
      boxWidth: "min-w-[160px] sm:min-w-[200px]",
      boxMinHeight: "min-h-[160px] sm:min-h-[200px]",
      imgBox: "w-24 sm:w-32 h-24 sm:h-32",
      imgRowHeight: "h-[110px] sm:h-[130px]",
    },
  };

  const { boxWidth, boxMinHeight, imgBox, imgRowHeight } =
    sizeStyles[size] || sizeStyles.medium;

  return (
    <div
      className={`border border-black w-fit overflow-hidden ${boxWidth} ${boxMinHeight} p-2 text-center flex flex-col justify-between`}>
      <div className={`flex flex-col justify-end gap-2 ${imgRowHeight}`}>
        {imageUrl && !imgError ? (
          <div className={`${imgBox} mx-auto flex items-center justify-center overflow-hidden`}>
            <img
              src={imageUrl}
              className="max-w-full max-h-full w-auto h-auto object-contain"
              alt={item.image_name}
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div
            className={`${imgBox} mx-auto flex items-center justify-center text-gray-400 text-xs`}>
            In preparation
          </div>
        )}
        {item.url ? (
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            <p
              className="text-xs hover:text-blue-700 whitespace-nowrap px-3"
              title={item.image_name}>
              {item.image_name}
            </p>
          </a>
        ) : (
          <p
            className="text-xs whitespace-nowrap px-3"
            title={item.image_name}>
            {item.image_name}
          </p>
        )}
      </div>
      <p className="text-sm border-t border-black py-1">
        {displayNumber !== null ? displayNumber : "—"}
      </p>
    </div>
  );
};

// ── Tree Node ─────────────────────────────────────────────────────────────────
const TreeNode = ({
  label,
  nodeKey,
  selectedKey,
  onSelect,
  children,
  depth = 0,
  openKeys,
}) => {
  const isSelected = selectedKey === nodeKey;
  const hasChildren = React.Children.count(children) > 0;
  const open = openKeys.has(nodeKey);

  const paddingLeft = depth === 0 ? "pl-4" : depth === 1 ? "pl-7" : "pl-10";

  const depthStyles =
    depth === 0
      ? "font-semibold text-[0.93rem] mt-2 py-3"
      : depth === 1
        ? "font-normal text-[0.87rem] mt-1 py-2.5"
        : "font-normal text-[0.83rem] mt-0.5 py-2";

  return (
    <div>
      <button
        onClick={() => onSelect(nodeKey, { hasChildren, isOpen: open })}
        className={`w-full text-left flex items-center justify-between gap-2 pr-4 text-sm transition-colors ${paddingLeft} ${depthStyles} ${
          isSelected
            ? "bg-[#3d4f39] text-white"
            : depth === 0
              ? "bg-[#50644b] text-white hover:bg-[#445840]"
              : depth === 1
                ? "bg-[#4a5e45] text-white/90 hover:bg-[#3d4f39]"
                : "bg-[#445840] text-white/80 hover:bg-[#3a4c36]"
        }`}>
        <span className="leading-snug">{label}</span>
        {hasChildren && (
          <span className="text-sm shrink-0 font-bold leading-none opacity-70">
            {open ? "−" : "+"}
          </span>
        )}
      </button>
      {hasChildren && open && (
        <div className="ml-0 mt-0.5 space-y-0.5 border-l-2 border-white/10 ml-4">
          {children}
        </div>
      )}
    </div>
  );
};

// ── Sidebar Content (shared between desktop & mobile drawer) ──────────────────
const SidebarContent = ({
  sortedCategories,
  getSubCategoriesForCategory,
  getChildCategoriesForSubCategory,
  selectedKey,
  onSelect,
  openKeys,
  loading = false,
}) => (
  <>
    <div className="p-3 bg-[#50644b] text-white text-sm font-semibold tracking-wide uppercase rounded-t-lg sticky top-0 z-10">
      Categories
    </div>
    {loading ? (
      <Loader className="py-10" />
    ) : (
      <nav className="py-2 flex flex-col">
        {sortedCategories.map((cat) => {
          const subCats = getSubCategoriesForCategory(cat.id);
          return (
            <TreeNode
              key={cat.id}
              label={cat.name}
              nodeKey={`cat_${cat.id}`}
              selectedKey={selectedKey}
              onSelect={onSelect}
              depth={0}
              openKeys={openKeys}>
              {subCats.map((sc) => {
                const childCats = getChildCategoriesForSubCategory(sc.id);
                return (
                  <TreeNode
                    key={sc.id}
                    label={sc.name}
                    nodeKey={`sub_${sc.id}`}
                    selectedKey={selectedKey}
                    onSelect={onSelect}
                    depth={1}
                    openKeys={openKeys}>
                    {childCats.map((cc) => (
                      <TreeNode
                        key={cc.id}
                        label={cc.name}
                        nodeKey={`child_${cc.id}`}
                        selectedKey={selectedKey}
                        onSelect={onSelect}
                        depth={2}
                        openKeys={openKeys}
                      />
                    ))}
                  </TreeNode>
                );
              })}
            </TreeNode>
          );
        })}
      </nav>
    )}
  </>
);

// ── URL helpers ────────────────────────────────────────────────────────────
// Category/sub-category/child-category names are turned into URL-safe slugs
// while keeping their actual script — Devanagari (ख, खि, र, ...) and IAST
// diacritics (ī, ū, ṛ, ḷ, ṝ, ā, ṅ, ṣ, ...) all pass through untouched; only
// whitespace and stray punctuation are collapsed into hyphens.
const slugify = (str) =>
  (str || "")
    .normalize("NFC") // compose any decomposed diacritics into single letters
    .replace(/[()]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "-") // collapse anything else, keep any script's letters/numbers
    .replace(/-+/g, "-")
    .replace(/(^-|-$)+/g, "");

// Inertia's page.url is percent-encoded (e.g. Devanagari / diacritics), so
// decode each segment before comparing it against our slugs.
const safeDecode = (segment) => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};

const decodePath = (path) =>
  (path || "")
    .split("/")
    .map(safeDecode)
    .join("/")
    .replace(/\/+$/, ""); // drop any trailing slash

// ── Main Component ────────────────────────────────────────────────────────────
const Palaeographical = () => {
  const [palaeographical, setPalaeographical] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [childCategory, setChildCategory] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openKeys, setOpenKeys] = useState(new Set());
  const [dataLoaded, setDataLoaded] = useState({
    palaeographical: false,
    subCategory: false,
    category: false,
    childCategory: false,
  });
  const [filters, setFilters] = useState({
    period: "All",
    script: "All",
    varna: "All",
    symbols: "All",
    citra: "All",
  });

  const drawerRef = useRef(null);
  const contentPanelRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Inertia: read the current path from the page url and pull the
  // category / sub-category / child-category slugs out of it.
  //   /palaeographical/{category}/{subCategory}/{childCategory}
  const { url } = usePage();
  const currentPath = decodePath((url || "").split("?")[0].split("#")[0]);
  const [, , rawCategorySlug, rawSubCategorySlug, rawChildCategorySlug] =
    currentPath.split("/");

  // Guards so the "URL → state" resolution runs once (after data loads), and
  // so the very first "state → URL" sync replaces history instead of pushing.
  const urlInitializedRef = useRef(false);
  const firstUrlSyncRef = useRef(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/palaeographical`)
      .then((r) => setPalaeographical(r.data.data))
      .catch(console.error)
      .finally(() => setDataLoaded((d) => ({ ...d, palaeographical: true })));
    axios
      .get(`${API_BASE_URL}/sub_categories`)
      .then((r) => setSubCategory(r.data.data))
      .catch(console.error)
      .finally(() => setDataLoaded((d) => ({ ...d, subCategory: true })));
    axios
      .get(`${API_BASE_URL}/categories`)
      .then((r) => setCategory(r.data.data))
      .catch(console.error)
      .finally(() => setDataLoaded((d) => ({ ...d, category: true })));
    axios
      .get(`${API_BASE_URL}/child_categories`)
      .then((r) => setChildCategory(r.data.data))
      .catch(console.error)
      .finally(() => setDataLoaded((d) => ({ ...d, childCategory: true })));
  }, []);

  // Close drawer on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (
        drawerOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target)
      ) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [drawerOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const sameId = (l, r) => l != null && r != null && String(l) === String(r);

  const sortedCategories = [...category].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  );

  const unique = (key) => [
    "All",
    ...new Set(palaeographical.map((i) => i[key]).filter(Boolean)),
  ];

  const filteredPalaeographical = palaeographical.filter((item) => {
    if (filters.period !== "All" && item.period !== filters.period)
      return false;
    if (filters.script !== "All" && item.script !== filters.script)
      return false;
    if (filters.varna !== "All" && item.varna !== filters.varna) return false;
    if (filters.symbols !== "All" && item.symbols !== filters.symbols)
      return false;
    if (filters.citra !== "All" && item.citra !== filters.citra) return false;
    return true;
  });

  const getSubCategoriesForCategory = (catId) =>
    subCategory
      .filter((sc) => sameId(sc.category_id, catId))
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const getChildCategoriesForSubCategory = (subCatId) =>
    [
      ...childCategory.filter((cc) => sameId(cc.sub_category_id, subCatId)),
      ...filteredPalaeographical
        .filter(
          (item) =>
            sameId(item.sub_category_id, subCatId) && item.child_category,
        )
        .map((item) => item.child_category),
    ]
      .filter(
        (cc, idx, arr) =>
          cc?.id !== undefined &&
          arr.findIndex((c) => sameId(c?.id, cc.id)) === idx,
      )
      .sort(
        (a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0),
      );

  const isNumeralCat = (cat) =>
    cat.name.toLowerCase().includes("aṅka") ||
    cat.name.toLowerCase().includes("anka") ||
    cat.name.toLowerCase().includes("numeral");

  const isPuspikaCat = (cat) =>
    cat.name.toLowerCase().includes("puṣpikā") ||
    cat.name.toLowerCase().includes("puspika") ||
    cat.name.toLowerCase().includes("pushpika");

  const isCitraCat = (cat) =>
    cat.name.toLowerCase().includes("citra") ||
    cat.name.toLowerCase().includes("figure");

  const getOpenPathForNode = (key, options = {}) => {
    if (!key) return [];

    if (key.startsWith("cat_")) {
      const catId = key.replace("cat_", "");
      const hasSubCategories = getSubCategoriesForCategory(catId).length > 0;
      return options.hasChildren ?? hasSubCategories ? [key] : [];
    }

    if (key.startsWith("sub_")) {
      const subId = key.replace("sub_", "");
      const currentSubCategory = subCategory.find((item) => sameId(item.id, subId));

      if (!currentSubCategory) return [];

      const hasChildCategories =
        options.hasChildren ?? getChildCategoriesForSubCategory(subId).length > 0;
      const path = [`cat_${currentSubCategory.category_id}`];

      if (hasChildCategories) {
        path.push(key);
      }

      return path;
    }

    if (key.startsWith("child_")) {
      const childId = key.replace("child_", "");
      const currentChildCategory =
        childCategory.find((item) => sameId(item.id, childId)) ||
        filteredPalaeographical.find((item) => sameId(item.child_category?.id, childId))
          ?.child_category;
      const parentSubId = currentChildCategory?.sub_category_id;

      if (!parentSubId) return [];

      const parentSubCategory = subCategory.find((item) => sameId(item.id, parentSubId));

      if (!parentSubCategory) return [];

      return [`cat_${parentSubCategory.category_id}`, `sub_${parentSubCategory.id}`];
    }

    return [];
  };

  const getClosedPathForNode = (key) => {
    if (!key) return [];

    if (key.startsWith("cat_")) {
      return [];
    }

    if (key.startsWith("sub_")) {
      const subId = key.replace("sub_", "");
      const currentSubCategory = subCategory.find((item) => sameId(item.id, subId));

      return currentSubCategory ? [`cat_${currentSubCategory.category_id}`] : [];
    }

    if (key.startsWith("child_")) {
      const childId = key.replace("child_", "");
      const currentChildCategory =
        childCategory.find((item) => sameId(item.id, childId)) ||
        filteredPalaeographical.find((item) => sameId(item.child_category?.id, childId))
          ?.child_category;
      const parentSubId = currentChildCategory?.sub_category_id;

      if (!parentSubId) return [];

      const parentSubCategory = subCategory.find((item) => sameId(item.id, parentSubId));

      return parentSubCategory
        ? [`cat_${parentSubCategory.category_id}`, `sub_${parentSubCategory.id}`]
        : [];
    }

    return [];
  };

  // Given a selectedKey, resolve the category/sub-category/child-category
  // *slugs* that make up its URL path.
  const getSlugsForKey = (key) => {
    if (!key) return {};

    if (key.startsWith("cat_")) {
      const catId = key.replace("cat_", "");
      const cat = category.find((c) => sameId(c.id, catId));
      if (!cat) return {};
      return { categorySlug: slugify(cat.name) };
    }

    if (key.startsWith("sub_")) {
      const subId = key.replace("sub_", "");
      const sc = subCategory.find((s) => sameId(s.id, subId));
      const cat = category.find((c) => sameId(c.id, sc?.category_id));
      if (!sc || !cat) return {};
      return {
        categorySlug: slugify(cat.name),
        subCategorySlug: slugify(sc.name),
      };
    }

    if (key.startsWith("child_")) {
      const childId = key.replace("child_", "");
      const cc =
        childCategory.find((c) => sameId(c.id, childId)) ||
        filteredPalaeographical.find((p) => sameId(p.child_category?.id, childId))
          ?.child_category;
      const sc = subCategory.find((s) => sameId(s.id, cc?.sub_category_id));
      const cat = category.find((c) => sameId(c.id, sc?.category_id));
      if (!cc || !sc || !cat) return {};
      return {
        categorySlug: slugify(cat.name),
        subCategorySlug: slugify(sc.name),
        childCategorySlug: slugify(cc.name),
      };
    }

    return {};
  };

  // Reverse of the above: given the slugs pulled from the URL, resolve the
  // deepest matching selectedKey (falls back up the chain on a partial miss).
  // If several sibling items happen to share a name/slug, the first match
  // (by creation order) wins — that's an acceptable trade-off for clean URLs.
  const getKeyForSlugs = (categorySlug, subCategorySlug, childCategorySlug) => {
    if (!categorySlug) return null;
    const cat = category.find((c) => slugify(c.name) === categorySlug);
    if (!cat) return null;

    if (!subCategorySlug) return `cat_${cat.id}`;
    const siblingSubs = subCategory.filter((s) => sameId(s.category_id, cat.id));
    const sc = siblingSubs.find((s) => slugify(s.name) === subCategorySlug);
    if (!sc) return `cat_${cat.id}`;

    if (!childCategorySlug) return `sub_${sc.id}`;
    const siblingChildren = getChildCategoriesForSubCategory(sc.id);
    const cc = siblingChildren.find((c) => slugify(c.name) === childCategorySlug);
    if (!cc) return `sub_${sc.id}`;

    return `child_${cc.id}`;
  };

  const buildPalaeographicalPath = (key) => {
    const { categorySlug, subCategorySlug, childCategorySlug } = getSlugsForKey(key);
    if (!categorySlug) return "/palaeographical";

    let path = `/palaeographical/${categorySlug}`;
    if (subCategorySlug) path += `/${subCategorySlug}`;
    if (childCategorySlug) path += `/${childCategorySlug}`;
    return path;
  };

  // URL → state: once all four endpoints have responded, resolve the
  // category/sub/child names in the URL (if any) to a selectedKey. If the
  // URL has no names, default to the first category and make the URL
  // canonical (replace, so it doesn't add a spurious history entry).
  useEffect(() => {
    if (urlInitializedRef.current) return;
    if (
      !dataLoaded.category ||
      !dataLoaded.subCategory ||
      !dataLoaded.childCategory ||
      !dataLoaded.palaeographical
    ) {
      return;
    }

    let resolvedKey = null;

    if (rawCategorySlug) {
      resolvedKey = getKeyForSlugs(rawCategorySlug, rawSubCategorySlug, rawChildCategorySlug);
    }

    if (!resolvedKey && category.length > 0) {
      const first = [...category].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at),
      )[0];
      resolvedKey = `cat_${first.id}`;
    }

    if (resolvedKey) {
      setSelectedKey(resolvedKey);
      setOpenKeys(new Set(getOpenPathForNode(resolvedKey)));
    }

    urlInitializedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoaded, category, subCategory, childCategory, rawCategorySlug, rawSubCategorySlug, rawChildCategorySlug]);

  // state → URL: whenever the selection changes (user click, or the initial
  // resolution above), keep the address bar in sync with the exact names.
  // Uses Inertia's router with preserveState/preserveScroll so the page
  // doesn't remount or jump while the URL updates.
  useEffect(() => {
    if (!urlInitializedRef.current || !selectedKey) return;

    const targetPath = buildPalaeographicalPath(selectedKey);
    if (targetPath === currentPath) return;

    router.visit(targetPath, {
      replace: firstUrlSyncRef.current,
      preserveState: true,
      preserveScroll: true,
    });
    firstUrlSyncRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey, category, subCategory, childCategory]);

  const resolveContent = (key) => {
    if (!key) return null;

    if (key.startsWith("cat_")) {
      const catId = key.replace("cat_", "");
      const cat = category.find((c) => String(c.id) === catId);
      const subCats = getSubCategoriesForCategory(catId);

      // If category has sub-categories → show hint only, never show category-level items
      if (subCats.length > 0) {
        return {
          title: cat?.name,
          items: [],
          isNumeral: cat ? isNumeralCat(cat) : false,
          isPuspika: cat ? isPuspikaCat(cat) : false,
          isCitra: cat ? isCitraCat(cat) : false,
          hint: "Select a sub-section from the left to view items.",
        };
      }

      // No sub-categories → show direct items
      const directItems = filteredPalaeographical
        .filter(
          (item) =>
            sameId(item.category_id, catId) &&
            item.sub_category_id == null &&
            item.child_category_id == null,
        )
        .sort(
          (a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0),
        );

      return {
        title: cat?.name,
        items: directItems,
        isNumeral: cat ? isNumeralCat(cat) : false,
        isPuspika: cat ? isPuspikaCat(cat) : false,
        isCitra: cat ? isCitraCat(cat) : false,
      };
    }

    if (key.startsWith("sub_")) {
      const subId = key.replace("sub_", "");
      const sc = subCategory.find((s) => String(s.id) === subId);
      const parentCat = category.find((c) => sameId(c.id, sc?.category_id));
      const childCats = getChildCategoriesForSubCategory(subId);

      // If sub-category has child categories → show hint only, never show sub-level items
      if (childCats.length > 0) {
        return {
          title: sc?.name,
          items: [],
          isNumeral: parentCat ? isNumeralCat(parentCat) : false,
          isPuspika: parentCat ? isPuspikaCat(parentCat) : false,
          isCitra: parentCat ? isCitraCat(parentCat) : false,
          hint: "Select a sub-section from the left to view items.",
        };
      }

      // No child categories → show direct items
      const items = filteredPalaeographical.filter((p) =>
        sameId(p.sub_category_id, subId),
      );

      return {
        title: sc?.name,
        items,
        isNumeral: parentCat ? isNumeralCat(parentCat) : false,
        isPuspika: parentCat ? isPuspikaCat(parentCat) : false,
        isCitra: parentCat ? isCitraCat(parentCat) : false,
      };
    }

    if (key.startsWith("child_")) {
      const childId = key.replace("child_", "");

      // Look up the child category from state first, then fall back to embedded objects
      const cc =
        childCategory.find((c) => String(c.id) === childId) ||
        filteredPalaeographical
          .find((p) => sameId(p.child_category?.id, childId))?.child_category;

      const parentSub = subCategory.find((s) =>
        sameId(s.id, cc?.sub_category_id),
      );
      const parentCat = category.find((c) =>
        sameId(c.id, parentSub?.category_id),
      );

      const items = filteredPalaeographical.filter(
        (p) =>
          sameId(p.child_category_id, childId) ||
          sameId(p.child_category?.id, childId),
      );

      return {
        title: cc?.name,
        items,
        isNumeral: parentCat ? isNumeralCat(parentCat) : false,
        isPuspika: parentCat ? isPuspikaCat(parentCat) : false,
        isCitra: parentCat ? isCitraCat(parentCat) : false,
      };
    }

    return null;
  };
  const content = resolveContent(selectedKey);

  // Box size for the current selection: Citra (figures) gets the biggest
  // boxes/images, Puṣpikā gets the large boxes, everything else is default.
  const boxSize = content
    ? content.isCitra
      ? "citra"
      : content.isPuspika
        ? "large"
        : "default"
    : "default";
  const useFlexibleBoxes = boxSize !== "default";

  // Loading = any of the four requests still pending, OR data is in but the
  // first category hasn't been auto-selected yet (avoids a one-frame flash of
  // "Select a category" / "In preparation" right after the data arrives).
  const isLoading =
    !dataLoaded.palaeographical ||
    !dataLoaded.subCategory ||
    !dataLoaded.category ||
    !dataLoaded.childCategory ||
    (selectedKey === null && category.length > 0);

  const handleTreeSelect = (key, options = {}) => {
    setSelectedKey(key);
    const nextOpenPath =
      options.hasChildren && options.isOpen
        ? getClosedPathForNode(key)
        : getOpenPathForNode(key, options);

    setOpenKeys(new Set(nextOpenPath));

    if (drawerOpen && !options.hasChildren) {
      setDrawerOpen(false);
    }
  };

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () =>
    setFilters({
      period: "All",
      script: "All",
      varna: "All",
      symbols: "All",
      citra: "All",
    });

  const sidebarProps = {
    sortedCategories,
    getSubCategoriesForCategory,
    getChildCategoriesForSubCategory,
    selectedKey,
    onSelect: handleTreeSelect,
    openKeys,
    loading: isLoading,
  };

  // Derive current category label for the mobile header button
  const selectedLabel = (() => {
    if (!selectedKey || !content?.title) return "Select Category";
    return content.title.length > 22
      ? content.title.slice(0, 22) + "…"
      : content.title;
  })();

  return (
    <>
      {/* Hero Banner */}
      <div className="relative h-[40vh] sm:h-[50vh] mt-12 flex items-center justify-center">
        <img
          src="/images/inscription/main.jpg"
          alt="Inscriptions"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute top-16 left-4 sm:left-6 z-10 text-white p-3 flex items-center gap-2 text-sm sm:text-base leading-6 tracking-wide">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <span className="opacity-80">Palaeographical Database</span>
        </div>
        <h1 className="relative px-4 z-10 text-2xl sm:text-4xl md:text-5xl text-white font-semibold text-center leading-tight">
          Palaeographical Database of Inscriptions
        </h1>
      </div>

      {/* Intro */}
      <div className="px-6 lg:px-20 mx-auto py-10 sm:py-16">
        <h2 className="text-xl sm:text-3xl font-semibold mb-4">
          Database of Palaeographical and Visual Features of Inscriptions
        </h2>
        <p className="text-base sm:text-lg mb-8 text-justify">
          Inscriptions are among the earliest forms of writing in human
          civilisation. This initiative aims to bring together palaeographic
          research to build a comprehensive, evolving repository of
          inscriptional features from Nepal across key historical periods,
          including the Licchavi, Malla, and Shah/Rana eras. The project enables
          both scholars and the wider public to explore, compare, and analyse
          inscriptions from the region. By examining dated and undated materials
          side by side, readers can better identify stylistic characteristics
          and historical patterns. Alongside textual analysis, the study also sheds
          light on craftsmanship, production techniques, usage contexts, and
          intellectual traditions, with particular attention to the evolution of
          scripts and visual paratextual elements.
        </p>

        <div className="max-w-3xl mx-auto px-4 pb-10 sm:pb-12 text-center text-sm leading-relaxed">
          <p className="font-medium break-words">
            नातिकृशैर्नातिदीर्घैर्ह्रस्वदीर्घादिलक्षितैः ।
          </p>
          <p className="font-medium break-words">
            सम्पूर्णावयवैर्मात्राबिन्दुसंयोगलक्षितै: ॥
          </p>
          <p>nātikṛśair nātidīrghair hrasvadīrghādilakṣitaiḥ |</p>
          <p>sampūrṇāvayavair mātrābindusaṃyogalakṣitaiḥ ||</p>
          <p className="mt-2">
            [The letters should not be] too broad or too thin,{" "}
            <br className="hidden sm:block" />
            the short and long vowel signs [should be] marked [properly],{" "}
            <br className="hidden sm:block" />
            all parts [of the letters should be] inscribed [fully],{" "}
            <br className="hidden sm:block" />
            [and] the dots and conjunctions [should be] marked [clearly].
          </p>
          <p className="text-xs mt-3 text-gray-600">
            (<span className="italic">Hayaśīrṣapañcarātra,</span> 2.31.11)
          </p>
          <div className="mt-4 flex justify-center">
            <div className="cursor-pointer w-full sm:w-3/4">
              <audio controls controlsList="nodownload" className="w-full">
                <source src="/images/database.wav" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        </div>

        <h2 className="mb-6 sm:mb-8 text-lg sm:text-2xl text-center">
          Our database is under development and continues to expand as new
          materials are added on ongoing basis. Visit and explore the
          collection!
        </h2>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 mb-6">
          {[
            { key: "period", label: "Period", allLabel: "All Periods" },
            { key: "script", label: "Script", allLabel: "All Scripts" },
            { key: "varna", label: "Varṇa", allLabel: "All Varṇa" },
            {
              key: "symbols",
              label: "Symbols, Signs",
              allLabel: "All Symbols",
            },
            { key: "citra", label: "Citra (figures)", allLabel: "All Citra" },
          ].map(({ key, label, allLabel }) => (
            <div key={key}>
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                {label}
              </label>
              <select
                className="border !border-black bg-transparent bg-none [appearance:auto] cursor-pointer p-2 sm:p-3 rounded w-full text-sm focus:ring-0 focus:border-black"
                value={filters[key]}
                onChange={(e) => handleFilterChange(key, e.target.value)}>
                {unique(key).map((v) => (
                  <option key={v} value={v}>
                    {v === "All" ? allLabel : v}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="flex justify-end mb-8 sm:mb-10">
          <button
            onClick={resetFilters}
            className="px-4 sm:px-6 py-2 border !border-black cursor-pointer rounded text-sm hover:bg-gray-100 transition">
            Reset Filters
          </button>
        </div>
      </div>

      {/* ── Two-Panel Layout ─────────────────────────────────────────────────── */}
      <div className="px-6 lg:px-20 mx-auto pb-24">
        {/* Mobile/Tablet: Category toggle button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#50644b] text-white text-sm font-medium rounded-lg shadow-sm w-full sm:w-auto">
            {/* Hamburger icon */}
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
              />
            </svg>
            <span>Categories</span>
            {selectedKey && content?.title && (
              <>
                <span className="opacity-50 mx-1">·</span>
                <span className="opacity-80 truncate">{selectedLabel}</span>
              </>
            )}
          </button>
        </div>

        <div className="flex gap-6 lg:gap-16 min-h-[500px] lg:min-h-[600px]">
          {/* ── Left: Desktop Sidebar ───────────────────────────────────────── */}
          <aside className="hidden lg:block w-96 shrink-0 border border-gray-200 rounded-lg overflow-y-auto self-start sticky top-4 ">
            <SidebarContent {...sidebarProps} />
          </aside>

          {/* ── Right: Content Panel ──────────────────────────────────────── */}
          <div
            ref={contentPanelRef}
            className="flex-1 p-4 sm:p-6 overflow-y-auto border border-gray-200 rounded-lg min-w-0 max-h-[80vh] self-start lg:sticky top-24">
            {isLoading ? (
              <Loader />
            ) : !selectedKey ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 gap-3 py-16 sm:py-20">
                <svg
                  width="48"
                  height="48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                  />
                </svg>
                <p className="text-base sm:text-lg font-medium">
                  Select a category
                </p>
                <p className="text-sm max-w-xs">
                  {window.innerWidth < 1024
                    ? 'Tap "Categories" above to browse.'
                    : "Click on any category, sub-category, or section to view its palaeographical items."}
                </p>
              </div>
            ) : content ? (
              <>
                <h3 className="text-xl font-poppins sm:text-2xl font-semibold mb-4 sm:mb-6">
                  <span className="font-poppins"> {content.title}</span>
                </h3>

                {content.hint && (
                  <p className="text-sm text-gray-500 italic mb-4 sm:mb-6">
                    {content.hint}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 sm:gap-6">
                  {content.items.length > 0
                    ? content.isNumeral
                      ? sortNumeralItems(content.items).map((item) => (
                          <NumeralBox key={item.id} item={item} size="medium" />
                        ))
                      : (() => {
                          const sortedItems = sortPalaeographicalItems(content.items);
                          const groupWidthCh = useFlexibleBoxes
                            ? null
                            : computeUniformWidthCh(
                                sortedItems.map(
                                  (item) => item.image_name || item.name || "Untitled",
                                ),
                              );
                          return sortedItems.map((item) => (
                            <CharacterBox
                              key={item.id}
                              image={item.image}
                              label={item.image_name || item.name || "Untitled"}
                              link={item.url || null}
                              hasData={true}
                              size={boxSize}
                              widthCh={groupWidthCh}
                            />
                          ));
                        })()
                    : !content.hint && (
                        <CharacterBox
                          label={`${content.title} (In preparation)`}
                          hasData={false}
                          size={boxSize}
                        />
                      )}
                </div>
              </>
            ) : (
              <CharacterBox label="In preparation" hasData={false} />
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer Overlay ──────────────────────────────────────────── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer panel */}
          <div
            ref={drawerRef}
            className="absolute top-12 left-0 bottom-0 w-[280px] sm:w-[320px] backdrop-blur-lg shadow-2xl flex flex-col overflow-hidden"
            style={{ animation: "slideInLeft 0.25s ease-out" }}>
            {/* Drawer header with close button */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#50644b] shrink-0">
              <span className="text-white font-semibold text-sm tracking-wide uppercase">
                Categories
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded"
                aria-label="Close categories">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable tree */}
            <div className="flex-1 min-h-0 overflow-y-auto pb-6">
              <SidebarContent {...sidebarProps} />
            </div>
          </div>
        </div>
      )}

      {/* Drawer animation keyframe */}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

Palaeographical.layout = (page) => <GuestLayout>{page}</GuestLayout>;

export default Palaeographical;

// import { Link, router, usePage } from "@inertiajs/react";
// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import GuestLayout from '@/Layouts/GuestLayout'

// // ── CharacterBox Component ────────────────────────────────────────────────────
// const CharacterBox = ({ image, label, link, hasData = true, large = false, widthCh = null }) => {
//   const [imgError, setImgError] = useState(false);
//   const imageBaseUrl = import.meta.env.VITE_IMAGE_PATH;

//   // Puṣpikā / Citra boxes stay flexible (grow to fit long names).
//   // All other boxes share one uniform width (widthCh, computed from the widest
//   // label in the group) so every box is the same size while the name still
//   // fits on a single line without wrapping or being cut off.
//   const useUniform = !large && widthCh;
//   const boxWidth = large
//     ? "min-w-[160px] sm:min-w-[200px] w-fit"
//     : useUniform
//       ? "" 
//       : "w-[120px] sm:w-[140px]";
//   const uniformStyle = useUniform ? { width: widthCh, minWidth: widthCh } : undefined;
//   const boxMinHeight = large
//     ? "min-h-[160px] sm:min-h-[200px]"
//     : "min-h-[120px] sm:min-h-[140px]";
//   const imgBox = large ? "w-24 sm:w-32 h-24 sm:h-32" : "w-14 sm:w-16 h-14 sm:h-16";
//   const placeholderBox = large
//     ? "w-24 sm:w-32 h-24 sm:h-32"
//     : "w-12 sm:w-16 h-12 sm:h-16";
//   const labelWrap = large || useUniform ? "whitespace-nowrap" : "break-words";

//   if (!hasData) {
//     // Empty/"in preparation" boxes always keep the original fixed size and
//     // wrapped centered text — not the uniform/single-line sizing used for
//     // boxes that actually have data.
//     const emptyBoxWidth = large
//       ? "w-[160px] sm:w-[200px]"
//       : "w-[120px] sm:w-[140px]";
//     return (
//       <div className={`inline-block border border-black mb-2  ${emptyBoxWidth}`}>
//         <div className={`${boxMinHeight} flex flex-col`}>
//           <div className="flex-1 p-3 sm:p-4 text-center">
//             <p className="mt-2 text-xs sm:text-sm text-gray-400 break-words">
//               {label}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const imageUrl = image
//     ? image.startsWith("http")
//       ? image
//       : `${imageBaseUrl}/${image}`
//     : null;

//   return (
//     <div
//       className={`inline-block border border-black mb-2 overflow-hidden ${boxWidth}`}
//       style={uniformStyle}>
//       <div className={`${boxMinHeight} flex flex-col`}>
//         <div className="flex-1 px-2 py-4 text-center">
//           {imageUrl && !imgError ? (
//             <div className={`${imgBox} mx-auto flex items-center justify-center overflow-hidden`}>
//               <img
//                 src={imageUrl}
//                 className="max-w-full max-h-full w-auto h-auto object-contain"
//                 alt={label}
//                 onError={() => setImgError(true)}
//               />
//             </div>
//           ) : (
//             <div
//               className={`${placeholderBox} mx-auto flex items-center justify-center text-gray-400 text-xs sm:text-sm`}>
//               {label}
//             </div>
//           )}
//           {link ? (
//             <a href={link} target="_blank" rel="noopener noreferrer">
//               <p
//                 className={`mt-2 text-xs sm:text-sm hover:text-blue-700 px-2 ${labelWrap}`}
//                 title={label}>
//                 {label}
//               </p>
//             </a>
//           ) : (
//             <p className={`mt-2 text-xs sm:text-sm px-2 ${labelWrap}`} title={label}>
//               {label}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ── Helper: uniform width for a group of CharacterBoxes ──────────────────────
// // Sizes every box in the group to fit the longest label on one line, with a
// // sensible floor so short/empty labels don't shrink the box below the default.
// //
// // NOTE: this used to return a value in `ch` units. `ch` is the width of the "0"
// // glyph in the box's *own* font, so the same label list produced different box
// // widths whenever the page's body font differed (e.g. Figtree vs the old
// // project's font) — 3 boxes per row in one project, 4 in the other. Pixels tied
// // to the label text (which has a fixed size) keep the result identical
// // everywhere. PX_PER_CHAR matches the sizing of the original React-only build.
// const PX_PER_CHAR = 8.7;

// const computeUniformWidthCh = (labels, minCh = 14) => {
//   const maxLen = labels.reduce(
//     (max, l) => Math.max(max, (l || "").length),
//     0,
//   );
//   return `${Math.round(Math.max(maxLen + 3, minCh) * PX_PER_CHAR)}px`;
// };

// // ── Helper: extract trailing number from image_name ──────────────────────────
// const extractSuffixNumber = (imageName) => {
//   if (!imageName) return null;
//   const match = imageName.match(/_(\d+)$/);
//   return match ? parseInt(match[1], 10) : null;
// };

// const sortNumeralItems = (items) =>
//   [...items].sort((a, b) => {
//     const numA = extractSuffixNumber(a.image_name) ?? Infinity;
//     const numB = extractSuffixNumber(b.image_name) ?? Infinity;
//     return numA - numB;
//   });

// // ── NumeralBox Component ──────────────────────────────────────────────────────
// const parsePalaeographicalImageName = (imageName) => {
//   if (!imageName) return null;

//   const match = imageName.match(
//     /^INSN(\d+)[A-Za-z](\d+(?:st|nd|rd|th)?)(?=_|\.|$)/i,
//   );
//   if (!match) return null;

//   const inscriptionNumber = parseInt(match[1], 10);
//   const dateToken = match[2].toLowerCase();
//   const centuryMatch = dateToken.match(/^(\d+)(?:st|nd|rd|th)$/);

//   if (centuryMatch) {
//     const century = parseInt(centuryMatch[1], 10);
//     return {
//       inscriptionNumber,
//       chronologicalKey: century * 100,
//       isCentury: true,
//     };
//   }

//   return {
//     inscriptionNumber,
//     chronologicalKey: parseInt(dateToken, 10),
//     isCentury: false,
//   };
// };

// const sortPalaeographicalItems = (items) =>
//   items
//     .map((item, index) => ({
//       item,
//       index,
//       parsed: parsePalaeographicalImageName(item.image_name),
//     }))
//     .sort((a, b) => {
//       if (a.parsed && b.parsed) {
//         if (a.parsed.chronologicalKey !== b.parsed.chronologicalKey) {
//           return a.parsed.chronologicalKey - b.parsed.chronologicalKey;
//         }

//         if (a.parsed.isCentury !== b.parsed.isCentury) {
//           return a.parsed.isCentury ? 1 : -1;
//         }

//         if (a.parsed.inscriptionNumber !== b.parsed.inscriptionNumber) {
//           return a.parsed.inscriptionNumber - b.parsed.inscriptionNumber;
//         }

//         return a.index - b.index;
//       }

//       if (a.parsed) return -1;
//       if (b.parsed) return 1;

//       const aOrder = a.item.order ?? null;
//       const bOrder = b.item.order ?? null;
//       if (aOrder !== null && bOrder !== null && aOrder !== bOrder) {
//         return aOrder - bOrder;
//       }
//       if (aOrder !== null && bOrder === null) return -1;
//       if (aOrder === null && bOrder !== null) return 1;

//       return a.index - b.index;
//     })
//     .map(({ item }) => item);

// // `size` controls the box footprint: 'small' (default/other categories),
// // 'medium' (Aṅka/numerals — smaller than large, bigger than small), or
// // 'large' (Puṣpikā/Citra).
// const NumeralBox = ({ item, size = "medium" }) => {
//   const [imgError, setImgError] = useState(false);
//   const imageBaseUrl = import.meta.env.VITE_IMAGE_PATH;
//   const imageUrl = item.image
//     ? item.image.startsWith("http")
//       ? item.image
//       : `${imageBaseUrl}/${item.image}`
//     : null;

//   const displayNumber = extractSuffixNumber(item.image_name);

//   const sizeStyles = {
//     small: {
//       boxWidth: "min-w-[120px] sm:min-w-[140px]",
//       boxMinHeight: "min-h-[120px] sm:min-h-[140px]",
//       imgBox: "w-12 sm:w-16 h-12 sm:h-16",
//       imgRowHeight: "h-[70px] sm:h-[80px]",
//     },
//     medium: {
//       boxWidth: "min-w-[135px] sm:min-w-[165px]",
//       boxMinHeight: "min-h-[135px] sm:min-h-[165px]",
//       imgBox: "w-[72px] sm:w-[96px] h-[72px] sm:h-[96px]",
//       imgRowHeight: "h-[90px] sm:h-[105px]",
//     },
//     large: {
//       boxWidth: "min-w-[160px] sm:min-w-[200px]",
//       boxMinHeight: "min-h-[160px] sm:min-h-[200px]",
//       imgBox: "w-24 sm:w-32 h-24 sm:h-32",
//       imgRowHeight: "h-[110px] sm:h-[130px]",
//     },
//   };

//   const { boxWidth, boxMinHeight, imgBox, imgRowHeight } =
//     sizeStyles[size] || sizeStyles.medium;

//   return (
//     <div
//       className={`border border-black w-fit overflow-hidden ${boxWidth} ${boxMinHeight} p-2 text-center flex flex-col justify-between`}>
//       <div className={`flex flex-col justify-end gap-2 ${imgRowHeight}`}>
//         {imageUrl && !imgError ? (
//           <div className={`${imgBox} mx-auto flex items-center justify-center overflow-hidden`}>
//             <img
//               src={imageUrl}
//               className="max-w-full max-h-full w-auto h-auto object-contain"
//               alt={item.image_name}
//               onError={() => setImgError(true)}
//             />
//           </div>
//         ) : (
//           <div
//             className={`${imgBox} mx-auto flex items-center justify-center text-gray-400 text-xs`}>
//             In preparation
//           </div>
//         )}
//         {item.url ? (
//           <a href={item.url} target="_blank" rel="noopener noreferrer">
//             <p
//               className="text-xs hover:text-blue-700 whitespace-nowrap px-3"
//               title={item.image_name}>
//               {item.image_name}
//             </p>
//           </a>
//         ) : (
//           <p
//             className="text-xs whitespace-nowrap px-3"
//             title={item.image_name}>
//             {item.image_name}
//           </p>
//         )}
//       </div>
//       <p className="text-sm border-t border-black py-1">
//         {displayNumber !== null ? displayNumber : "—"}
//       </p>
//     </div>
//   );
// };

// // ── Tree Node ─────────────────────────────────────────────────────────────────
// const TreeNode = ({
//   label,
//   nodeKey,
//   selectedKey,
//   onSelect,
//   children,
//   depth = 0,
//   openKeys,
// }) => {
//   const isSelected = selectedKey === nodeKey;
//   const hasChildren = React.Children.count(children) > 0;
//   const open = openKeys.has(nodeKey);

//   const paddingLeft = depth === 0 ? "pl-4" : depth === 1 ? "pl-7" : "pl-10";

//   const depthStyles =
//     depth === 0
//       ? "font-semibold text-[0.93rem] mt-2 py-3"
//       : depth === 1
//         ? "font-normal text-[0.87rem] mt-1 py-2.5"
//         : "font-normal text-[0.83rem] mt-0.5 py-2";

//   return (
//     <div>
//       <button
//         onClick={() => onSelect(nodeKey, { hasChildren, isOpen: open })}
//         className={`w-full text-left flex items-center justify-between gap-2 pr-4 text-sm transition-colors ${paddingLeft} ${depthStyles} ${
//           isSelected
//             ? "bg-[#3d4f39] text-white"
//             : depth === 0
//               ? "bg-[#50644b] text-white hover:bg-[#445840]"
//               : depth === 1
//                 ? "bg-[#4a5e45] text-white/90 hover:bg-[#3d4f39]"
//                 : "bg-[#445840] text-white/80 hover:bg-[#3a4c36]"
//         }`}>
//         <span className="leading-snug">{label}</span>
//         {hasChildren && (
//           <span className="text-sm shrink-0 font-bold leading-none opacity-70">
//             {open ? "−" : "+"}
//           </span>
//         )}
//       </button>
//       {hasChildren && open && (
//         <div className="ml-0 mt-0.5 space-y-0.5 border-l-2 border-white/10 ml-4">
//           {children}
//         </div>
//       )}
//     </div>
//   );
// };

// // ── Sidebar Content (shared between desktop & mobile drawer) ──────────────────
// const SidebarContent = ({
//   sortedCategories,
//   getSubCategoriesForCategory,
//   getChildCategoriesForSubCategory,
//   selectedKey,
//   onSelect,
//   openKeys,
// }) => (
//   <>
//     <div className="p-3 bg-[#50644b] text-white text-sm font-semibold tracking-wide uppercase rounded-t-lg sticky top-0 z-10">
//       Categories
//     </div>
//     <nav className="py-2 flex flex-col">
//       {sortedCategories.map((cat) => {
//         const subCats = getSubCategoriesForCategory(cat.id);
//         return (
//           <TreeNode
//             key={cat.id}
//             label={cat.name}
//             nodeKey={`cat_${cat.id}`}
//             selectedKey={selectedKey}
//             onSelect={onSelect}
//             depth={0}
//             openKeys={openKeys}>
//             {subCats.map((sc) => {
//               const childCats = getChildCategoriesForSubCategory(sc.id);
//               return (
//                 <TreeNode
//                   key={sc.id}
//                   label={sc.name}
//                   nodeKey={`sub_${sc.id}`}
//                   selectedKey={selectedKey}
//                   onSelect={onSelect}
//                   depth={1}
//                   openKeys={openKeys}>
//                   {childCats.map((cc) => (
//                     <TreeNode
//                       key={cc.id}
//                       label={cc.name}
//                       nodeKey={`child_${cc.id}`}
//                       selectedKey={selectedKey}
//                       onSelect={onSelect}
//                       depth={2}
//                       openKeys={openKeys}
//                     />
//                   ))}
//                 </TreeNode>
//               );
//             })}
//           </TreeNode>
//         );
//       })}
//     </nav>
//   </>
// );

// // ── URL helpers ────────────────────────────────────────────────────────────
// // Category/sub-category/child-category names are turned into URL-safe slugs
// // while keeping their actual script — Devanagari (ख, खि, र, ...) and IAST
// // diacritics (ī, ū, ṛ, ḷ, ṝ, ā, ṅ, ṣ, ...) all pass through untouched; only
// // whitespace and stray punctuation are collapsed into hyphens.
// const slugify = (str) =>
//   (str || "")
//     .normalize("NFC") // compose any decomposed diacritics into single letters
//     .replace(/[()]/g, "")
//     .trim()
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^\p{L}\p{N}-]+/gu, "-") // collapse anything else, keep any script's letters/numbers
//     .replace(/-+/g, "-")
//     .replace(/(^-|-$)+/g, "");

// // Inertia gives us the raw (percent-encoded) URL, whereas React Router's
// // useParams() used to hand back decoded values. Decode safely ourselves.
// const safeDecode = (value) => {
//   try {
//     return decodeURIComponent(value);
//   } catch {
//     return value;
//   }
// };

// // ── Main Component ────────────────────────────────────────────────────────────
// const Palaeographical = () => {
//   const [palaeographical, setPalaeographical] = useState([]);
//   const [subCategory, setSubCategory] = useState([]);
//   const [childCategory, setChildCategory] = useState([]);
//   const [category, setCategory] = useState([]);
//   const [selectedKey, setSelectedKey] = useState(null);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [openKeys, setOpenKeys] = useState(new Set());
//   const [dataLoaded, setDataLoaded] = useState({
//     palaeographical: false,
//     subCategory: false,
//     category: false,
//     childCategory: false,
//   });
//   const [filters, setFilters] = useState({
//     period: "All",
//     script: "All",
//     varna: "All",
//     symbols: "All",
//     citra: "All",
//   });

//   const drawerRef = useRef(null);
//   const contentPanelRef = useRef(null);
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//   // Inertia replacement for useLocation() + useParams():
//   // usePage().url is e.g. "/palaeographical/<category>/<sub>/<child>?x=1"
//   // so we read the path segments from it and decode them.
//   const { url } = usePage();
//   const pathSegments = url
//     .split("?")[0]
//     .split("#")[0]
//     .split("/")
//     .filter(Boolean)
//     .map(safeDecode);
//   const currentPathname = `/${pathSegments.join("/")}`;
//   const [, rawCategorySlug, rawSubCategorySlug, rawChildCategorySlug] =
//     pathSegments;

//   // Guards so the "URL → state" resolution runs once (after data loads), and
//   // so the very first "state → URL" sync replaces history instead of pushing.
//   const urlInitializedRef = useRef(false);
//   const firstUrlSyncRef = useRef(true);

//   useEffect(() => {
//     axios
//       .get(`${API_BASE_URL}/palaeographical`)
//       .then((r) => setPalaeographical(r.data.data))
//       .catch(console.error)
//       .finally(() => setDataLoaded((d) => ({ ...d, palaeographical: true })));
//     axios
//       .get(`${API_BASE_URL}/sub_categories`)
//       .then((r) => setSubCategory(r.data.data))
//       .catch(console.error)
//       .finally(() => setDataLoaded((d) => ({ ...d, subCategory: true })));
//     axios
//       .get(`${API_BASE_URL}/categories`)
//       .then((r) => setCategory(r.data.data))
//       .catch(console.error)
//       .finally(() => setDataLoaded((d) => ({ ...d, category: true })));
//     axios
//       .get(`${API_BASE_URL}/child_categories`)
//       .then((r) => setChildCategory(r.data.data))
//       .catch(console.error)
//       .finally(() => setDataLoaded((d) => ({ ...d, childCategory: true })));
//   }, []);

//   // Close drawer on outside click
//   useEffect(() => {
//     const handleOutside = (e) => {
//       if (
//         drawerOpen &&
//         drawerRef.current &&
//         !drawerRef.current.contains(e.target)
//       ) {
//         setDrawerOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleOutside);
//     return () => document.removeEventListener("mousedown", handleOutside);
//   }, [drawerOpen]);

//   // Prevent body scroll when drawer is open
//   useEffect(() => {
//     if (drawerOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [drawerOpen]);

//   const sameId = (l, r) => l != null && r != null && String(l) === String(r);

//   const sortedCategories = [...category].sort(
//     (a, b) => new Date(a.created_at) - new Date(b.created_at),
//   );

//   const unique = (key) => [
//     "All",
//     ...new Set(palaeographical.map((i) => i[key]).filter(Boolean)),
//   ];

//   const filteredPalaeographical = palaeographical.filter((item) => {
//     if (filters.period !== "All" && item.period !== filters.period)
//       return false;
//     if (filters.script !== "All" && item.script !== filters.script)
//       return false;
//     if (filters.varna !== "All" && item.varna !== filters.varna) return false;
//     if (filters.symbols !== "All" && item.symbols !== filters.symbols)
//       return false;
//     if (filters.citra !== "All" && item.citra !== filters.citra) return false;
//     return true;
//   });

//   const getSubCategoriesForCategory = (catId) =>
//     subCategory
//       .filter((sc) => sameId(sc.category_id, catId))
//       .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

//   const getChildCategoriesForSubCategory = (subCatId) =>
//     [
//       ...childCategory.filter((cc) => sameId(cc.sub_category_id, subCatId)),
//       ...filteredPalaeographical
//         .filter(
//           (item) =>
//             sameId(item.sub_category_id, subCatId) && item.child_category,
//         )
//         .map((item) => item.child_category),
//     ]
//       .filter(
//         (cc, idx, arr) =>
//           cc?.id !== undefined &&
//           arr.findIndex((c) => sameId(c?.id, cc.id)) === idx,
//       )
//       .sort(
//         (a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0),
//       );

//   const isNumeralCat = (cat) =>
//     cat.name.toLowerCase().includes("aṅka") ||
//     cat.name.toLowerCase().includes("anka") ||
//     cat.name.toLowerCase().includes("numeral");

//   const isPuspikaCat = (cat) =>
//     cat.name.toLowerCase().includes("puṣpikā") ||
//     cat.name.toLowerCase().includes("puspika") ||
//     cat.name.toLowerCase().includes("pushpika");

//   const isCitraCat = (cat) =>
//     cat.name.toLowerCase().includes("citra") ||
//     cat.name.toLowerCase().includes("figure");

//   const getOpenPathForNode = (key, options = {}) => {
//     if (!key) return [];

//     if (key.startsWith("cat_")) {
//       const catId = key.replace("cat_", "");
//       const hasSubCategories = getSubCategoriesForCategory(catId).length > 0;
//       return options.hasChildren ?? hasSubCategories ? [key] : [];
//     }

//     if (key.startsWith("sub_")) {
//       const subId = key.replace("sub_", "");
//       const currentSubCategory = subCategory.find((item) => sameId(item.id, subId));

//       if (!currentSubCategory) return [];

//       const hasChildCategories =
//         options.hasChildren ?? getChildCategoriesForSubCategory(subId).length > 0;
//       const path = [`cat_${currentSubCategory.category_id}`];

//       if (hasChildCategories) {
//         path.push(key);
//       }

//       return path;
//     }

//     if (key.startsWith("child_")) {
//       const childId = key.replace("child_", "");
//       const currentChildCategory =
//         childCategory.find((item) => sameId(item.id, childId)) ||
//         filteredPalaeographical.find((item) => sameId(item.child_category?.id, childId))
//           ?.child_category;
//       const parentSubId = currentChildCategory?.sub_category_id;

//       if (!parentSubId) return [];

//       const parentSubCategory = subCategory.find((item) => sameId(item.id, parentSubId));

//       if (!parentSubCategory) return [];

//       return [`cat_${parentSubCategory.category_id}`, `sub_${parentSubCategory.id}`];
//     }

//     return [];
//   };

//   const getClosedPathForNode = (key) => {
//     if (!key) return [];

//     if (key.startsWith("cat_")) {
//       return [];
//     }

//     if (key.startsWith("sub_")) {
//       const subId = key.replace("sub_", "");
//       const currentSubCategory = subCategory.find((item) => sameId(item.id, subId));

//       return currentSubCategory ? [`cat_${currentSubCategory.category_id}`] : [];
//     }

//     if (key.startsWith("child_")) {
//       const childId = key.replace("child_", "");
//       const currentChildCategory =
//         childCategory.find((item) => sameId(item.id, childId)) ||
//         filteredPalaeographical.find((item) => sameId(item.child_category?.id, childId))
//           ?.child_category;
//       const parentSubId = currentChildCategory?.sub_category_id;

//       if (!parentSubId) return [];

//       const parentSubCategory = subCategory.find((item) => sameId(item.id, parentSubId));

//       return parentSubCategory
//         ? [`cat_${parentSubCategory.category_id}`, `sub_${parentSubCategory.id}`]
//         : [];
//     }

//     return [];
//   };

//   // Given a selectedKey, resolve the category/sub-category/child-category
//   // *slugs* that make up its URL path.
//   const getSlugsForKey = (key) => {
//     if (!key) return {};

//     if (key.startsWith("cat_")) {
//       const catId = key.replace("cat_", "");
//       const cat = category.find((c) => sameId(c.id, catId));
//       if (!cat) return {};
//       return { categorySlug: slugify(cat.name) };
//     }

//     if (key.startsWith("sub_")) {
//       const subId = key.replace("sub_", "");
//       const sc = subCategory.find((s) => sameId(s.id, subId));
//       const cat = category.find((c) => sameId(c.id, sc?.category_id));
//       if (!sc || !cat) return {};
//       return {
//         categorySlug: slugify(cat.name),
//         subCategorySlug: slugify(sc.name),
//       };
//     }

//     if (key.startsWith("child_")) {
//       const childId = key.replace("child_", "");
//       const cc =
//         childCategory.find((c) => sameId(c.id, childId)) ||
//         filteredPalaeographical.find((p) => sameId(p.child_category?.id, childId))
//           ?.child_category;
//       const sc = subCategory.find((s) => sameId(s.id, cc?.sub_category_id));
//       const cat = category.find((c) => sameId(c.id, sc?.category_id));
//       if (!cc || !sc || !cat) return {};
//       return {
//         categorySlug: slugify(cat.name),
//         subCategorySlug: slugify(sc.name),
//         childCategorySlug: slugify(cc.name),
//       };
//     }

//     return {};
//   };

//   // Reverse of the above: given the slugs pulled from the URL, resolve the
//   // deepest matching selectedKey (falls back up the chain on a partial miss).
//   // If several sibling items happen to share a name/slug, the first match
//   // (by creation order) wins — that's an acceptable trade-off for clean URLs.
//   const getKeyForSlugs = (categorySlug, subCategorySlug, childCategorySlug) => {
//     if (!categorySlug) return null;
//     const cat = category.find((c) => slugify(c.name) === categorySlug);
//     if (!cat) return null;

//     if (!subCategorySlug) return `cat_${cat.id}`;
//     const siblingSubs = subCategory.filter((s) => sameId(s.category_id, cat.id));
//     const sc = siblingSubs.find((s) => slugify(s.name) === subCategorySlug);
//     if (!sc) return `cat_${cat.id}`;

//     if (!childCategorySlug) return `sub_${sc.id}`;
//     const siblingChildren = getChildCategoriesForSubCategory(sc.id);
//     const cc = siblingChildren.find((c) => slugify(c.name) === childCategorySlug);
//     if (!cc) return `sub_${sc.id}`;

//     return `child_${cc.id}`;
//   };

//   const buildPalaeographicalPath = (key) => {
//     const { categorySlug, subCategorySlug, childCategorySlug } = getSlugsForKey(key);
//     if (!categorySlug) return "/palaeographical";

//     let path = `/palaeographical/${categorySlug}`;
//     if (subCategorySlug) path += `/${subCategorySlug}`;
//     if (childCategorySlug) path += `/${childCategorySlug}`;
//     return path;
//   };

//   // URL → state: once all four endpoints have responded, resolve the
//   // category/sub/child names in the URL (if any) to a selectedKey. If the
//   // URL has no names, default to the first category and make the URL
//   // canonical (replace, so it doesn't add a spurious history entry).
//   useEffect(() => {
//     if (urlInitializedRef.current) return;
//     if (
//       !dataLoaded.category ||
//       !dataLoaded.subCategory ||
//       !dataLoaded.childCategory ||
//       !dataLoaded.palaeographical
//     ) {
//       return;
//     }

//     let resolvedKey = null;

//     if (rawCategorySlug) {
//       resolvedKey = getKeyForSlugs(rawCategorySlug, rawSubCategorySlug, rawChildCategorySlug);
//     }

//     if (!resolvedKey && category.length > 0) {
//       const first = [...category].sort(
//         (a, b) => new Date(a.created_at) - new Date(b.created_at),
//       )[0];
//       resolvedKey = `cat_${first.id}`;
//     }

//     if (resolvedKey) {
//       setSelectedKey(resolvedKey);
//       setOpenKeys(new Set(getOpenPathForNode(resolvedKey)));
//     }

//     urlInitializedRef.current = true;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dataLoaded, category, subCategory, childCategory, rawCategorySlug, rawSubCategorySlug, rawChildCategorySlug]);

//   // state → URL: whenever the selection changes (user click, or the initial
//   // resolution above), keep the address bar in sync with the exact names.
//   //
//   // preserveState keeps this component (and all its local state) mounted
//   // instead of remounting it on the Inertia visit, and preserveScroll stops
//   // the page jumping to the top on every click.
//   useEffect(() => {
//     if (!urlInitializedRef.current || !selectedKey) return;

//     const targetPath = buildPalaeographicalPath(selectedKey);
//     if (targetPath === currentPathname) return;

//     router.visit(targetPath, {
//       replace: firstUrlSyncRef.current,
//       preserveState: true,
//       preserveScroll: true,
//     });
//     firstUrlSyncRef.current = false;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedKey, category, subCategory, childCategory]);

//   const resolveContent = (key) => {
//     if (!key) return null;

//     if (key.startsWith("cat_")) {
//       const catId = key.replace("cat_", "");
//       const cat = category.find((c) => String(c.id) === catId);
//       const subCats = getSubCategoriesForCategory(catId);

//       // If category has sub-categories → show hint only, never show category-level items
//       if (subCats.length > 0) {
//         return {
//           title: cat?.name,
//           items: [],
//           isNumeral: cat ? isNumeralCat(cat) : false,
//           isPuspika: cat ? isPuspikaCat(cat) : false,
//           isCitra: cat ? isCitraCat(cat) : false,
//           hint: "Select a sub-section from the left to view items.",
//         };
//       }

//       // No sub-categories → show direct items
//       const directItems = filteredPalaeographical
//         .filter(
//           (item) =>
//             sameId(item.category_id, catId) &&
//             item.sub_category_id == null &&
//             item.child_category_id == null,
//         )
//         .sort(
//           (a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0),
//         );

//       return {
//         title: cat?.name,
//         items: directItems,
//         isNumeral: cat ? isNumeralCat(cat) : false,
//         isPuspika: cat ? isPuspikaCat(cat) : false,
//         isCitra: cat ? isCitraCat(cat) : false,
//       };
//     }

//     if (key.startsWith("sub_")) {
//       const subId = key.replace("sub_", "");
//       const sc = subCategory.find((s) => String(s.id) === subId);
//       const parentCat = category.find((c) => sameId(c.id, sc?.category_id));
//       const childCats = getChildCategoriesForSubCategory(subId);

//       // If sub-category has child categories → show hint only, never show sub-level items
//       if (childCats.length > 0) {
//         return {
//           title: sc?.name,
//           items: [],
//           isNumeral: parentCat ? isNumeralCat(parentCat) : false,
//           isPuspika: parentCat ? isPuspikaCat(parentCat) : false,
//           isCitra: parentCat ? isCitraCat(parentCat) : false,
//           hint: "Select a sub-section from the left to view items.",
//         };
//       }

//       // No child categories → show direct items
//       const items = filteredPalaeographical.filter((p) =>
//         sameId(p.sub_category_id, subId),
//       );

//       return {
//         title: sc?.name,
//         items,
//         isNumeral: parentCat ? isNumeralCat(parentCat) : false,
//         isPuspika: parentCat ? isPuspikaCat(parentCat) : false,
//         isCitra: parentCat ? isCitraCat(parentCat) : false,
//       };
//     }

//     if (key.startsWith("child_")) {
//       const childId = key.replace("child_", "");

//       // Look up the child category from state first, then fall back to embedded objects
//       const cc =
//         childCategory.find((c) => String(c.id) === childId) ||
//         filteredPalaeographical
//           .find((p) => sameId(p.child_category?.id, childId))?.child_category;

//       const parentSub = subCategory.find((s) =>
//         sameId(s.id, cc?.sub_category_id),
//       );
//       const parentCat = category.find((c) =>
//         sameId(c.id, parentSub?.category_id),
//       );

//       const items = filteredPalaeographical.filter(
//         (p) =>
//           sameId(p.child_category_id, childId) ||
//           sameId(p.child_category?.id, childId),
//       );

//       return {
//         title: cc?.name,
//         items,
//         isNumeral: parentCat ? isNumeralCat(parentCat) : false,
//         isPuspika: parentCat ? isPuspikaCat(parentCat) : false,
//         isCitra: parentCat ? isCitraCat(parentCat) : false,
//       };
//     }

//     return null;
//   };
//   const content = resolveContent(selectedKey);
//   const useLargeBoxes = content ? content.isPuspika || content.isCitra : false;

//   const handleTreeSelect = (key, options = {}) => {
//     setSelectedKey(key);
//     const nextOpenPath =
//       options.hasChildren && options.isOpen
//         ? getClosedPathForNode(key)
//         : getOpenPathForNode(key, options);

//     setOpenKeys(new Set(nextOpenPath));

//     if (drawerOpen && !options.hasChildren) {
//       setDrawerOpen(false);
//     }
//   };

//   const handleFilterChange = (key, value) =>
//     setFilters((prev) => ({ ...prev, [key]: value }));

//   const resetFilters = () =>
//     setFilters({
//       period: "All",
//       script: "All",
//       varna: "All",
//       symbols: "All",
//       citra: "All",
//     });

//   const sidebarProps = {
//     sortedCategories,
//     getSubCategoriesForCategory,
//     getChildCategoriesForSubCategory,
//     selectedKey,
//     onSelect: handleTreeSelect,
//     openKeys,
//   };

//   // Derive current category label for the mobile header button
//   const selectedLabel = (() => {
//     if (!selectedKey || !content?.title) return "Select Category";
//     return content.title.length > 22
//       ? content.title.slice(0, 22) + "…"
//       : content.title;
//   })();

//   return (
//     <>
//       {/* Hero Banner */}
//       <div className="relative h-[40vh] sm:h-[50vh] mt-12 flex items-center justify-center">
//         <img
//           src="/images/inscription/main.jpg"
//           alt="Inscriptions"
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black/40"></div>
//         <div className="absolute top-16 left-4 sm:left-6 z-10 text-white p-3 flex items-center gap-2 text-sm sm:text-base leading-6 tracking-wide">
//           <Link href="/" className="hover:underline">
//             Home
//           </Link>
//           <span>/</span>
//           <span className="opacity-80">Palaeographical Database</span>
//         </div>
//         <h1 className="relative px-4 z-10 text-2xl sm:text-4xl md:text-5xl text-white font-semibold text-center leading-tight">
//           Palaeographical Database of Inscriptions
//         </h1>
//       </div>

//       {/* Intro */}
//       <div className="px-6 lg:px-20 mx-auto py-10 sm:py-16">
//         <h2 className="text-xl sm:text-3xl font-semibold mb-4">
//           Database of Palaeographical and Visual Features of Inscriptions
//         </h2>
//         <p className="text-base sm:text-lg mb-8 text-justify">
//           Inscriptions are among the earliest forms of writing in human
//           civilisation. This initiative aims to bring together palaeographic
//           research to build a comprehensive, evolving repository of
//           inscriptional features from Nepal across key historical periods,
//           including the Licchavi, Malla, and Shah/Rana eras. The project enables
//           both scholars and the wider public to explore, compare, and analyse
//           inscriptions from the region. By examining dated and undated materials
//           side by side, readers can better identify stylistic characteristics
//           and historical patterns. Alongside textual analysis, the study also sheds
//           light on craftsmanship, production techniques, usage contexts, and
//           intellectual traditions, with particular attention to the evolution of
//           scripts and visual paratextual elements.
//         </p>

//         <div className="max-w-3xl mx-auto px-4 pb-10 sm:pb-12 text-center text-sm leading-relaxed">
//           <p className="font-medium break-words">
//             नातिकृशैर्नातिदीर्घैर्ह्रस्वदीर्घादिलक्षितैः ।
//           </p>
//           <p className="font-medium break-words">
//             सम्पूर्णावयवैर्मात्राबिन्दुसंयोगलक्षितै: ॥
//           </p>
//           <p>nātikṛśair nātidīrghair hrasvadīrghādilakṣitaiḥ |</p>
//           <p>sampūrṇāvayavair mātrābindusaṃyogalakṣitaiḥ ||</p>
//           <p className="mt-2">
//             [The letters should not be] too broad or too thin,{" "}
//             <br className="hidden sm:block" />
//             the short and long vowel signs [should be] marked [properly],{" "}
//             <br className="hidden sm:block" />
//             all parts [of the letters should be] inscribed [fully],{" "}
//             <br className="hidden sm:block" />
//             [and] the dots and conjunctions [should be] marked [clearly].
//           </p>
//           <p className="text-xs mt-3 text-gray-600">
//             (<span className="italic">Hayaśīrṣapañcarātra,</span> 2.31.11)
//           </p>
//           <div className="mt-4 flex justify-center">
//             <div className="cursor-pointer w-full sm:w-3/4">
//               <audio controls controlsList="nodownload" className="w-full">
//                 <source src="/images/database.wav" type="audio/mpeg" />
//                 Your browser does not support the audio element.
//               </audio>
//             </div>
//           </div>
//         </div>

//         <h2 className="mb-6 sm:mb-8 text-lg sm:text-2xl text-center">
//           Our database is under development and continues to expand as new
//           materials are added on ongoing basis. Visit and explore the
//           collection!
//         </h2>

//         {/* Filters */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 mb-6">
//           {[
//             { key: "period", label: "Period", allLabel: "All Periods" },
//             { key: "script", label: "Script", allLabel: "All Scripts" },
//             { key: "varna", label: "Varṇa", allLabel: "All Varṇa" },
//             {
//               key: "symbols",
//               label: "Symbols, Signs",
//               allLabel: "All Symbols",
//             },
//             { key: "citra", label: "Citra (figures)", allLabel: "All Citra" },
//           ].map(({ key, label, allLabel }) => (
//             <div key={key}>
//               <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
//                 {label}
//               </label>
//               <select
//                 className="border cursor-pointer p-2 sm:p-3 rounded w-full text-sm"
//                 value={filters[key]}
//                 onChange={(e) => handleFilterChange(key, e.target.value)}>
//                 {unique(key).map((v) => (
//                   <option key={v} value={v}>
//                     {v === "All" ? allLabel : v}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-end mb-8 sm:mb-10">
//           <button
//             onClick={resetFilters}
//             className="px-4 sm:px-6 py-2 border cursor-pointer rounded text-sm hover:bg-gray-100 transition">
//             Reset Filters
//           </button>
//         </div>
//       </div>

//       {/* ── Two-Panel Layout ─────────────────────────────────────────────────── */}
//       <div className="px-6 lg:px-20 mx-auto pb-24">
//         {/* Mobile/Tablet: Category toggle button */}
//         <div className="lg:hidden mb-4">
//           <button
//             onClick={() => setDrawerOpen(true)}
//             className="flex items-center gap-2 px-4 py-2.5 bg-[#50644b] text-white text-sm font-medium rounded-lg shadow-sm w-full sm:w-auto">
//             {/* Hamburger icon */}
//             <svg
//               width="18"
//               height="18"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
//               />
//             </svg>
//             <span>Categories</span>
//             {selectedKey && content?.title && (
//               <>
//                 <span className="opacity-50 mx-1">·</span>
//                 <span className="opacity-80 truncate">{selectedLabel}</span>
//               </>
//             )}
//           </button>
//         </div>

//         <div className="flex gap-6 lg:gap-16 min-h-[500px] lg:min-h-[600px]">
//           {/* ── Left: Desktop Sidebar ───────────────────────────────────────── */}
//           <aside className="hidden lg:block w-96 shrink-0 border border-gray-200 rounded-lg overflow-y-auto self-start sticky top-4 ">
//             <SidebarContent {...sidebarProps} />
//           </aside>

//           {/* ── Right: Content Panel ──────────────────────────────────────── */}
//           <div
//             ref={contentPanelRef}
//             className="flex-1 p-4 sm:p-6 overflow-y-auto border border-gray-200 rounded-lg min-w-0 max-h-[80vh] self-start lg:sticky top-24">
//             {!selectedKey ? (
//               <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 gap-3 py-16 sm:py-20">
//                 <svg
//                   width="48"
//                   height="48"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="1.5"
//                   viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
//                   />
//                 </svg>
//                 <p className="text-base sm:text-lg font-medium">
//                   Select a category
//                 </p>
//                 <p className="text-sm max-w-xs">
//                   {window.innerWidth < 1024
//                     ? 'Tap "Categories" above to browse.'
//                     : "Click on any category, sub-category, or section to view its palaeographical items."}
//                 </p>
//               </div>
//             ) : content ? (
//               <>
//                 <h3 className="text-xl font-poppins sm:text-2xl font-semibold mb-4 sm:mb-6">
//                  <span className="font-poppins"> {content.title}</span>
//                 </h3>

//                 {content.hint && (
//                   <p className="text-sm text-gray-500 italic mb-4 sm:mb-6">
//                     {content.hint}
//                   </p>
//                 )}

//                 <div className="flex flex-wrap gap-3 sm:gap-6">
//                   {content.items.length > 0
//                     ? content.isNumeral
//                       ? sortNumeralItems(content.items).map((item) => (
//                           <NumeralBox key={item.id} item={item} size="medium" />
//                         ))
//                       : (() => {
//                           const sortedItems = sortPalaeographicalItems(content.items);
//                           const groupWidthCh = useLargeBoxes
//                             ? null
//                             : computeUniformWidthCh(
//                                 sortedItems.map(
//                                   (item) => item.image_name || item.name || "Untitled",
//                                 ),
//                               );
//                           return sortedItems.map((item) => (
//                             <CharacterBox
//                               key={item.id}
//                               image={item.image}
//                               label={item.image_name || item.name || "Untitled"}
//                               link={item.url || null}
//                               hasData={true}
//                               large={useLargeBoxes}
//                               widthCh={groupWidthCh}
//                             />
//                           ));
//                         })()
//                     : !content.hint && (
//                         <CharacterBox
//                           label={`${content.title} (In preparation)`}
//                           hasData={false}
//                           large={useLargeBoxes}
//                         />
//                       )}
//                 </div>
//               </>
//             ) : (
//               <CharacterBox label="In preparation" hasData={false} />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ── Mobile Drawer Overlay ──────────────────────────────────────────── */}
//       {drawerOpen && (
//         <div className="fixed inset-0 z-50 lg:hidden">
//           {/* Backdrop */}
//           <div
//             className="absolute inset-0 bg-black/50 transition-opacity"
//             onClick={() => setDrawerOpen(false)}
//           />

//           {/* Drawer panel */}
//           <div
//             ref={drawerRef}
//             className="absolute top-12 left-0 bottom-0 w-[280px] sm:w-[320px] backdrop-blur-lg shadow-2xl flex flex-col overflow-hidden"
//             style={{ animation: "slideInLeft 0.25s ease-out" }}>
//             {/* Drawer header with close button */}
//             <div className="flex items-center justify-between px-4 py-3 bg-[#50644b] shrink-0">
//               <span className="text-white font-semibold text-sm tracking-wide uppercase">
//                 Categories
//               </span>
//               <button
//                 onClick={() => setDrawerOpen(false)}
//                 className="text-white/80 hover:text-white transition-colors p-1 rounded"
//                 aria-label="Close categories">
//                 <svg
//                   width="20"
//                   height="20"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>

//             {/* Scrollable tree */}
//             <div className="flex-1 min-h-0 overflow-y-auto pb-6">
//               <SidebarContent {...sidebarProps} />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Drawer animation keyframe */}
//       <style>{`
//         @keyframes slideInLeft {
//           from { transform: translateX(-100%); }
//           to   { transform: translateX(0); }
//         }
//       `}</style>
//     </>
//   );
// };

// Palaeographical.layout = (page) => <GuestLayout>{page}</GuestLayout>;

// export default Palaeographical;




// import { Link, router, usePage } from "@inertiajs/react";
// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import GuestLayout from '@/Layouts/GuestLayout'

// // ── CharacterBox Component ────────────────────────────────────────────────────
// const CharacterBox = ({ image, label, link, hasData = true, large = false, widthCh = null }) => {
//   const [imgError, setImgError] = useState(false);
//   const imageBaseUrl = import.meta.env.VITE_IMAGE_PATH;

//   // Puṣpikā / Citra boxes stay flexible (grow to fit long names).
//   // All other boxes share one uniform width (widthCh, computed from the widest
//   // label in the group) so every box is the same size while the name still
//   // fits on a single line without wrapping or being cut off.
//   const useUniform = !large && widthCh;
//   const boxWidth = large
//     ? "min-w-[160px] sm:min-w-[200px] w-fit"
//     : useUniform
//       ? "" 
//       : "w-[120px] sm:w-[140px]";
//   const uniformStyle = useUniform ? { width: widthCh, minWidth: widthCh } : undefined;
//   const boxMinHeight = large
//     ? "min-h-[160px] sm:min-h-[200px]"
//     : "min-h-[120px] sm:min-h-[140px]";
//   const imgBox = large ? "w-24 sm:w-32 h-24 sm:h-32" : "w-14 sm:w-16 h-14 sm:h-16";
//   const placeholderBox = large
//     ? "w-24 sm:w-32 h-24 sm:h-32"
//     : "w-12 sm:w-16 h-12 sm:h-16";
//   const labelWrap = large || useUniform ? "whitespace-nowrap" : "break-words";

//   if (!hasData) {
//     // Empty/"in preparation" boxes always keep the original fixed size and
//     // wrapped centered text — not the uniform/single-line sizing used for
//     // boxes that actually have data.
//     const emptyBoxWidth = large
//       ? "w-[160px] sm:w-[200px]"
//       : "w-[120px] sm:w-[140px]";
//     return (
//       <div className={`inline-block border border-black mb-2  ${emptyBoxWidth}`}>
//         <div className={`${boxMinHeight} flex flex-col`}>
//           <div className="flex-1 p-3 sm:p-4 text-center">
//             <p className="mt-2 text-xs sm:text-sm text-gray-400 break-words">
//               {label}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const imageUrl = image
//     ? image.startsWith("http")
//       ? image
//       : `${imageBaseUrl}/${image}`
//     : null;

//   return (
//     <div
//       className={`inline-block border border-black mb-2 overflow-hidden ${boxWidth}`}
//       style={uniformStyle}>
//       <div className={`${boxMinHeight} flex flex-col`}>
//         <div className="flex-1 px-2 py-4 text-center">
//           {imageUrl && !imgError ? (
//             <div className={`${imgBox} mx-auto flex items-center justify-center overflow-hidden`}>
//               <img
//                 src={imageUrl}
//                 className="max-w-full max-h-full w-auto h-auto object-contain"
//                 alt={label}
//                 onError={() => setImgError(true)}
//               />
//             </div>
//           ) : (
//             <div
//               className={`${placeholderBox} mx-auto flex items-center justify-center text-gray-400 text-xs sm:text-sm`}>
//               {label}
//             </div>
//           )}
//           {link ? (
//             <a href={link} target="_blank" rel="noopener noreferrer">
//               <p
//                 className={`mt-2 text-xs sm:text-sm hover:text-blue-700 px-2 ${labelWrap}`}
//                 title={label}>
//                 {label}
//               </p>
//             </a>
//           ) : (
//             <p className={`mt-2 text-xs sm:text-sm px-2 ${labelWrap}`} title={label}>
//               {label}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ── Helper: uniform width (in ch units) for a group of CharacterBoxes ────────
// // Sizes every box in the group to fit the longest label on one line, with a
// // sensible floor so short/empty labels don't shrink the box below the default.
// const computeUniformWidthCh = (labels, minCh = 14) => {
//   const maxLen = labels.reduce(
//     (max, l) => Math.max(max, (l || "").length),
//     0,
//   );
//   return `${Math.max(maxLen + 3, minCh)}ch`;
// };

// // ── Helper: extract trailing number from image_name ──────────────────────────
// const extractSuffixNumber = (imageName) => {
//   if (!imageName) return null;
//   const match = imageName.match(/_(\d+)$/);
//   return match ? parseInt(match[1], 10) : null;
// };

// const sortNumeralItems = (items) =>
//   [...items].sort((a, b) => {
//     const numA = extractSuffixNumber(a.image_name) ?? Infinity;
//     const numB = extractSuffixNumber(b.image_name) ?? Infinity;
//     return numA - numB;
//   });

// // ── NumeralBox Component ──────────────────────────────────────────────────────
// const parsePalaeographicalImageName = (imageName) => {
//   if (!imageName) return null;

//   const match = imageName.match(
//     /^INSN(\d+)[A-Za-z](\d+(?:st|nd|rd|th)?)(?=_|\.|$)/i,
//   );
//   if (!match) return null;

//   const inscriptionNumber = parseInt(match[1], 10);
//   const dateToken = match[2].toLowerCase();
//   const centuryMatch = dateToken.match(/^(\d+)(?:st|nd|rd|th)$/);

//   if (centuryMatch) {
//     const century = parseInt(centuryMatch[1], 10);
//     return {
//       inscriptionNumber,
//       chronologicalKey: century * 100,
//       isCentury: true,
//     };
//   }

//   return {
//     inscriptionNumber,
//     chronologicalKey: parseInt(dateToken, 10),
//     isCentury: false,
//   };
// };

// const sortPalaeographicalItems = (items) =>
//   items
//     .map((item, index) => ({
//       item,
//       index,
//       parsed: parsePalaeographicalImageName(item.image_name),
//     }))
//     .sort((a, b) => {
//       if (a.parsed && b.parsed) {
//         if (a.parsed.chronologicalKey !== b.parsed.chronologicalKey) {
//           return a.parsed.chronologicalKey - b.parsed.chronologicalKey;
//         }

//         if (a.parsed.isCentury !== b.parsed.isCentury) {
//           return a.parsed.isCentury ? 1 : -1;
//         }

//         if (a.parsed.inscriptionNumber !== b.parsed.inscriptionNumber) {
//           return a.parsed.inscriptionNumber - b.parsed.inscriptionNumber;
//         }

//         return a.index - b.index;
//       }

//       if (a.parsed) return -1;
//       if (b.parsed) return 1;

//       const aOrder = a.item.order ?? null;
//       const bOrder = b.item.order ?? null;
//       if (aOrder !== null && bOrder !== null && aOrder !== bOrder) {
//         return aOrder - bOrder;
//       }
//       if (aOrder !== null && bOrder === null) return -1;
//       if (aOrder === null && bOrder !== null) return 1;

//       return a.index - b.index;
//     })
//     .map(({ item }) => item);

// // `size` controls the box footprint: 'small' (default/other categories),
// // 'medium' (Aṅka/numerals — smaller than large, bigger than small), or
// // 'large' (Puṣpikā/Citra).
// const NumeralBox = ({ item, size = "medium" }) => {
//   const [imgError, setImgError] = useState(false);
//   const imageBaseUrl = import.meta.env.VITE_IMAGE_PATH;
//   const imageUrl = item.image
//     ? item.image.startsWith("http")
//       ? item.image
//       : `${imageBaseUrl}/${item.image}`
//     : null;

//   const displayNumber = extractSuffixNumber(item.image_name);

//   const sizeStyles = {
//     small: {
//       boxWidth: "min-w-[120px] sm:min-w-[140px]",
//       boxMinHeight: "min-h-[120px] sm:min-h-[140px]",
//       imgBox: "w-12 sm:w-16 h-12 sm:h-16",
//       imgRowHeight: "h-[70px] sm:h-[80px]",
//     },
//     medium: {
//       boxWidth: "min-w-[135px] sm:min-w-[165px]",
//       boxMinHeight: "min-h-[135px] sm:min-h-[165px]",
//       imgBox: "w-[72px] sm:w-[96px] h-[72px] sm:h-[96px]",
//       imgRowHeight: "h-[90px] sm:h-[105px]",
//     },
//     large: {
//       boxWidth: "min-w-[160px] sm:min-w-[200px]",
//       boxMinHeight: "min-h-[160px] sm:min-h-[200px]",
//       imgBox: "w-24 sm:w-32 h-24 sm:h-32",
//       imgRowHeight: "h-[110px] sm:h-[130px]",
//     },
//   };

//   const { boxWidth, boxMinHeight, imgBox, imgRowHeight } =
//     sizeStyles[size] || sizeStyles.medium;

//   return (
//     <div
//       className={`border border-black w-fit overflow-hidden ${boxWidth} ${boxMinHeight} p-2 text-center flex flex-col justify-between`}>
//       <div className={`flex flex-col justify-end gap-2 ${imgRowHeight}`}>
//         {imageUrl && !imgError ? (
//           <div className={`${imgBox} mx-auto flex items-center justify-center overflow-hidden`}>
//             <img
//               src={imageUrl}
//               className="max-w-full max-h-full w-auto h-auto object-contain"
//               alt={item.image_name}
//               onError={() => setImgError(true)}
//             />
//           </div>
//         ) : (
//           <div
//             className={`${imgBox} mx-auto flex items-center justify-center text-gray-400 text-xs`}>
//             In preparation
//           </div>
//         )}
//         {item.url ? (
//           <a href={item.url} target="_blank" rel="noopener noreferrer">
//             <p
//               className="text-xs hover:text-blue-700 whitespace-nowrap px-3"
//               title={item.image_name}>
//               {item.image_name}
//             </p>
//           </a>
//         ) : (
//           <p
//             className="text-xs whitespace-nowrap px-3"
//             title={item.image_name}>
//             {item.image_name}
//           </p>
//         )}
//       </div>
//       <p className="text-sm border-t border-black py-1">
//         {displayNumber !== null ? displayNumber : "—"}
//       </p>
//     </div>
//   );
// };

// // ── Tree Node ─────────────────────────────────────────────────────────────────
// const TreeNode = ({
//   label,
//   nodeKey,
//   selectedKey,
//   onSelect,
//   children,
//   depth = 0,
//   openKeys,
// }) => {
//   const isSelected = selectedKey === nodeKey;
//   const hasChildren = React.Children.count(children) > 0;
//   const open = openKeys.has(nodeKey);

//   const paddingLeft = depth === 0 ? "pl-4" : depth === 1 ? "pl-7" : "pl-10";

//   const depthStyles =
//     depth === 0
//       ? "font-semibold text-[0.93rem] mt-2 py-3"
//       : depth === 1
//         ? "font-normal text-[0.87rem] mt-1 py-2.5"
//         : "font-normal text-[0.83rem] mt-0.5 py-2";

//   return (
//     <div>
//       <button
//         onClick={() => onSelect(nodeKey, { hasChildren, isOpen: open })}
//         className={`w-full text-left flex items-center justify-between gap-2 pr-4 text-sm transition-colors ${paddingLeft} ${depthStyles} ${
//           isSelected
//             ? "bg-[#3d4f39] text-white"
//             : depth === 0
//               ? "bg-[#50644b] text-white hover:bg-[#445840]"
//               : depth === 1
//                 ? "bg-[#4a5e45] text-white/90 hover:bg-[#3d4f39]"
//                 : "bg-[#445840] text-white/80 hover:bg-[#3a4c36]"
//         }`}>
//         <span className="leading-snug">{label}</span>
//         {hasChildren && (
//           <span className="text-sm shrink-0 font-bold leading-none opacity-70">
//             {open ? "−" : "+"}
//           </span>
//         )}
//       </button>
//       {hasChildren && open && (
//         <div className="ml-0 mt-0.5 space-y-0.5 border-l-2 border-white/10 ml-4">
//           {children}
//         </div>
//       )}
//     </div>
//   );
// };

// // ── Sidebar Content (shared between desktop & mobile drawer) ──────────────────
// const SidebarContent = ({
//   sortedCategories,
//   getSubCategoriesForCategory,
//   getChildCategoriesForSubCategory,
//   selectedKey,
//   onSelect,
//   openKeys,
// }) => (
//   <>
//     <div className="p-3 bg-[#50644b] text-white text-sm font-semibold tracking-wide uppercase rounded-t-lg sticky top-0 z-10">
//       Categories
//     </div>
//     <nav className="py-2 flex flex-col">
//       {sortedCategories.map((cat) => {
//         const subCats = getSubCategoriesForCategory(cat.id);
//         return (
//           <TreeNode
//             key={cat.id}
//             label={cat.name}
//             nodeKey={`cat_${cat.id}`}
//             selectedKey={selectedKey}
//             onSelect={onSelect}
//             depth={0}
//             openKeys={openKeys}>
//             {subCats.map((sc) => {
//               const childCats = getChildCategoriesForSubCategory(sc.id);
//               return (
//                 <TreeNode
//                   key={sc.id}
//                   label={sc.name}
//                   nodeKey={`sub_${sc.id}`}
//                   selectedKey={selectedKey}
//                   onSelect={onSelect}
//                   depth={1}
//                   openKeys={openKeys}>
//                   {childCats.map((cc) => (
//                     <TreeNode
//                       key={cc.id}
//                       label={cc.name}
//                       nodeKey={`child_${cc.id}`}
//                       selectedKey={selectedKey}
//                       onSelect={onSelect}
//                       depth={2}
//                       openKeys={openKeys}
//                     />
//                   ))}
//                 </TreeNode>
//               );
//             })}
//           </TreeNode>
//         );
//       })}
//     </nav>
//   </>
// );

// // ── URL helpers ────────────────────────────────────────────────────────────
// // Category/sub-category/child-category names are turned into URL-safe slugs
// // while keeping their actual script — Devanagari (ख, खि, र, ...) and IAST
// // diacritics (ī, ū, ṛ, ḷ, ṝ, ā, ṅ, ṣ, ...) all pass through untouched; only
// // whitespace and stray punctuation are collapsed into hyphens.
// const slugify = (str) =>
//   (str || "")
//     .normalize("NFC") // compose any decomposed diacritics into single letters
//     .replace(/[()]/g, "")
//     .trim()
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^\p{L}\p{N}-]+/gu, "-") // collapse anything else, keep any script's letters/numbers
//     .replace(/-+/g, "-")
//     .replace(/(^-|-$)+/g, "");

// // Inertia gives us the raw (percent-encoded) URL, whereas React Router's
// // useParams() used to hand back decoded values. Decode safely ourselves.
// const safeDecode = (value) => {
//   try {
//     return decodeURIComponent(value);
//   } catch {
//     return value;
//   }
// };

// // ── Main Component ────────────────────────────────────────────────────────────
// const Palaeographical = () => {
//   const [palaeographical, setPalaeographical] = useState([]);
//   const [subCategory, setSubCategory] = useState([]);
//   const [childCategory, setChildCategory] = useState([]);
//   const [category, setCategory] = useState([]);
//   const [selectedKey, setSelectedKey] = useState(null);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [openKeys, setOpenKeys] = useState(new Set());
//   const [dataLoaded, setDataLoaded] = useState({
//     palaeographical: false,
//     subCategory: false,
//     category: false,
//     childCategory: false,
//   });
//   const [filters, setFilters] = useState({
//     period: "All",
//     script: "All",
//     varna: "All",
//     symbols: "All",
//     citra: "All",
//   });

//   const drawerRef = useRef(null);
//   const contentPanelRef = useRef(null);
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//   // Inertia replacement for useLocation() + useParams():
//   // usePage().url is e.g. "/palaeographical/<category>/<sub>/<child>?x=1"
//   // so we read the path segments from it and decode them.
//   const { url } = usePage();
//   const pathSegments = url
//     .split("?")[0]
//     .split("#")[0]
//     .split("/")
//     .filter(Boolean)
//     .map(safeDecode);
//   const currentPathname = `/${pathSegments.join("/")}`;
//   const [, rawCategorySlug, rawSubCategorySlug, rawChildCategorySlug] =
//     pathSegments;

//   // Guards so the "URL → state" resolution runs once (after data loads), and
//   // so the very first "state → URL" sync replaces history instead of pushing.
//   const urlInitializedRef = useRef(false);
//   const firstUrlSyncRef = useRef(true);

//   useEffect(() => {
//     axios
//       .get(`${API_BASE_URL}/palaeographical`)
//       .then((r) => setPalaeographical(r.data.data))
//       .catch(console.error)
//       .finally(() => setDataLoaded((d) => ({ ...d, palaeographical: true })));
//     axios
//       .get(`${API_BASE_URL}/sub_categories`)
//       .then((r) => setSubCategory(r.data.data))
//       .catch(console.error)
//       .finally(() => setDataLoaded((d) => ({ ...d, subCategory: true })));
//     axios
//       .get(`${API_BASE_URL}/categories`)
//       .then((r) => setCategory(r.data.data))
//       .catch(console.error)
//       .finally(() => setDataLoaded((d) => ({ ...d, category: true })));
//     axios
//       .get(`${API_BASE_URL}/child_categories`)
//       .then((r) => setChildCategory(r.data.data))
//       .catch(console.error)
//       .finally(() => setDataLoaded((d) => ({ ...d, childCategory: true })));
//   }, []);

//   // Close drawer on outside click
//   useEffect(() => {
//     const handleOutside = (e) => {
//       if (
//         drawerOpen &&
//         drawerRef.current &&
//         !drawerRef.current.contains(e.target)
//       ) {
//         setDrawerOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleOutside);
//     return () => document.removeEventListener("mousedown", handleOutside);
//   }, [drawerOpen]);

//   // Prevent body scroll when drawer is open
//   useEffect(() => {
//     if (drawerOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [drawerOpen]);

//   const sameId = (l, r) => l != null && r != null && String(l) === String(r);

//   const sortedCategories = [...category].sort(
//     (a, b) => new Date(a.created_at) - new Date(b.created_at),
//   );

//   const unique = (key) => [
//     "All",
//     ...new Set(palaeographical.map((i) => i[key]).filter(Boolean)),
//   ];

//   const filteredPalaeographical = palaeographical.filter((item) => {
//     if (filters.period !== "All" && item.period !== filters.period)
//       return false;
//     if (filters.script !== "All" && item.script !== filters.script)
//       return false;
//     if (filters.varna !== "All" && item.varna !== filters.varna) return false;
//     if (filters.symbols !== "All" && item.symbols !== filters.symbols)
//       return false;
//     if (filters.citra !== "All" && item.citra !== filters.citra) return false;
//     return true;
//   });

//   const getSubCategoriesForCategory = (catId) =>
//     subCategory
//       .filter((sc) => sameId(sc.category_id, catId))
//       .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

//   const getChildCategoriesForSubCategory = (subCatId) =>
//     [
//       ...childCategory.filter((cc) => sameId(cc.sub_category_id, subCatId)),
//       ...filteredPalaeographical
//         .filter(
//           (item) =>
//             sameId(item.sub_category_id, subCatId) && item.child_category,
//         )
//         .map((item) => item.child_category),
//     ]
//       .filter(
//         (cc, idx, arr) =>
//           cc?.id !== undefined &&
//           arr.findIndex((c) => sameId(c?.id, cc.id)) === idx,
//       )
//       .sort(
//         (a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0),
//       );

//   const isNumeralCat = (cat) =>
//     cat.name.toLowerCase().includes("aṅka") ||
//     cat.name.toLowerCase().includes("anka") ||
//     cat.name.toLowerCase().includes("numeral");

//   const isPuspikaCat = (cat) =>
//     cat.name.toLowerCase().includes("puṣpikā") ||
//     cat.name.toLowerCase().includes("puspika") ||
//     cat.name.toLowerCase().includes("pushpika");

//   const isCitraCat = (cat) =>
//     cat.name.toLowerCase().includes("citra") ||
//     cat.name.toLowerCase().includes("figure");

//   const getOpenPathForNode = (key, options = {}) => {
//     if (!key) return [];

//     if (key.startsWith("cat_")) {
//       const catId = key.replace("cat_", "");
//       const hasSubCategories = getSubCategoriesForCategory(catId).length > 0;
//       return options.hasChildren ?? hasSubCategories ? [key] : [];
//     }

//     if (key.startsWith("sub_")) {
//       const subId = key.replace("sub_", "");
//       const currentSubCategory = subCategory.find((item) => sameId(item.id, subId));

//       if (!currentSubCategory) return [];

//       const hasChildCategories =
//         options.hasChildren ?? getChildCategoriesForSubCategory(subId).length > 0;
//       const path = [`cat_${currentSubCategory.category_id}`];

//       if (hasChildCategories) {
//         path.push(key);
//       }

//       return path;
//     }

//     if (key.startsWith("child_")) {
//       const childId = key.replace("child_", "");
//       const currentChildCategory =
//         childCategory.find((item) => sameId(item.id, childId)) ||
//         filteredPalaeographical.find((item) => sameId(item.child_category?.id, childId))
//           ?.child_category;
//       const parentSubId = currentChildCategory?.sub_category_id;

//       if (!parentSubId) return [];

//       const parentSubCategory = subCategory.find((item) => sameId(item.id, parentSubId));

//       if (!parentSubCategory) return [];

//       return [`cat_${parentSubCategory.category_id}`, `sub_${parentSubCategory.id}`];
//     }

//     return [];
//   };

//   const getClosedPathForNode = (key) => {
//     if (!key) return [];

//     if (key.startsWith("cat_")) {
//       return [];
//     }

//     if (key.startsWith("sub_")) {
//       const subId = key.replace("sub_", "");
//       const currentSubCategory = subCategory.find((item) => sameId(item.id, subId));

//       return currentSubCategory ? [`cat_${currentSubCategory.category_id}`] : [];
//     }

//     if (key.startsWith("child_")) {
//       const childId = key.replace("child_", "");
//       const currentChildCategory =
//         childCategory.find((item) => sameId(item.id, childId)) ||
//         filteredPalaeographical.find((item) => sameId(item.child_category?.id, childId))
//           ?.child_category;
//       const parentSubId = currentChildCategory?.sub_category_id;

//       if (!parentSubId) return [];

//       const parentSubCategory = subCategory.find((item) => sameId(item.id, parentSubId));

//       return parentSubCategory
//         ? [`cat_${parentSubCategory.category_id}`, `sub_${parentSubCategory.id}`]
//         : [];
//     }

//     return [];
//   };

//   // Given a selectedKey, resolve the category/sub-category/child-category
//   // *slugs* that make up its URL path.
//   const getSlugsForKey = (key) => {
//     if (!key) return {};

//     if (key.startsWith("cat_")) {
//       const catId = key.replace("cat_", "");
//       const cat = category.find((c) => sameId(c.id, catId));
//       if (!cat) return {};
//       return { categorySlug: slugify(cat.name) };
//     }

//     if (key.startsWith("sub_")) {
//       const subId = key.replace("sub_", "");
//       const sc = subCategory.find((s) => sameId(s.id, subId));
//       const cat = category.find((c) => sameId(c.id, sc?.category_id));
//       if (!sc || !cat) return {};
//       return {
//         categorySlug: slugify(cat.name),
//         subCategorySlug: slugify(sc.name),
//       };
//     }

//     if (key.startsWith("child_")) {
//       const childId = key.replace("child_", "");
//       const cc =
//         childCategory.find((c) => sameId(c.id, childId)) ||
//         filteredPalaeographical.find((p) => sameId(p.child_category?.id, childId))
//           ?.child_category;
//       const sc = subCategory.find((s) => sameId(s.id, cc?.sub_category_id));
//       const cat = category.find((c) => sameId(c.id, sc?.category_id));
//       if (!cc || !sc || !cat) return {};
//       return {
//         categorySlug: slugify(cat.name),
//         subCategorySlug: slugify(sc.name),
//         childCategorySlug: slugify(cc.name),
//       };
//     }

//     return {};
//   };

//   // Reverse of the above: given the slugs pulled from the URL, resolve the
//   // deepest matching selectedKey (falls back up the chain on a partial miss).
//   // If several sibling items happen to share a name/slug, the first match
//   // (by creation order) wins — that's an acceptable trade-off for clean URLs.
//   const getKeyForSlugs = (categorySlug, subCategorySlug, childCategorySlug) => {
//     if (!categorySlug) return null;
//     const cat = category.find((c) => slugify(c.name) === categorySlug);
//     if (!cat) return null;

//     if (!subCategorySlug) return `cat_${cat.id}`;
//     const siblingSubs = subCategory.filter((s) => sameId(s.category_id, cat.id));
//     const sc = siblingSubs.find((s) => slugify(s.name) === subCategorySlug);
//     if (!sc) return `cat_${cat.id}`;

//     if (!childCategorySlug) return `sub_${sc.id}`;
//     const siblingChildren = getChildCategoriesForSubCategory(sc.id);
//     const cc = siblingChildren.find((c) => slugify(c.name) === childCategorySlug);
//     if (!cc) return `sub_${sc.id}`;

//     return `child_${cc.id}`;
//   };

//   const buildPalaeographicalPath = (key) => {
//     const { categorySlug, subCategorySlug, childCategorySlug } = getSlugsForKey(key);
//     if (!categorySlug) return "/palaeographical";

//     let path = `/palaeographical/${categorySlug}`;
//     if (subCategorySlug) path += `/${subCategorySlug}`;
//     if (childCategorySlug) path += `/${childCategorySlug}`;
//     return path;
//   };

//   // URL → state: once all four endpoints have responded, resolve the
//   // category/sub/child names in the URL (if any) to a selectedKey. If the
//   // URL has no names, default to the first category and make the URL
//   // canonical (replace, so it doesn't add a spurious history entry).
//   useEffect(() => {
//     if (urlInitializedRef.current) return;
//     if (
//       !dataLoaded.category ||
//       !dataLoaded.subCategory ||
//       !dataLoaded.childCategory ||
//       !dataLoaded.palaeographical
//     ) {
//       return;
//     }

//     let resolvedKey = null;

//     if (rawCategorySlug) {
//       resolvedKey = getKeyForSlugs(rawCategorySlug, rawSubCategorySlug, rawChildCategorySlug);
//     }

//     if (!resolvedKey && category.length > 0) {
//       const first = [...category].sort(
//         (a, b) => new Date(a.created_at) - new Date(b.created_at),
//       )[0];
//       resolvedKey = `cat_${first.id}`;
//     }

//     if (resolvedKey) {
//       setSelectedKey(resolvedKey);
//       setOpenKeys(new Set(getOpenPathForNode(resolvedKey)));
//     }

//     urlInitializedRef.current = true;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dataLoaded, category, subCategory, childCategory, rawCategorySlug, rawSubCategorySlug, rawChildCategorySlug]);

//   // state → URL: whenever the selection changes (user click, or the initial
//   // resolution above), keep the address bar in sync with the exact names.
//   //
//   // preserveState keeps this component (and all its local state) mounted
//   // instead of remounting it on the Inertia visit, and preserveScroll stops
//   // the page jumping to the top on every click.
//   useEffect(() => {
//     if (!urlInitializedRef.current || !selectedKey) return;

//     const targetPath = buildPalaeographicalPath(selectedKey);
//     if (targetPath === currentPathname) return;

//     router.visit(targetPath, {
//       replace: firstUrlSyncRef.current,
//       preserveState: true,
//       preserveScroll: true,
//     });
//     firstUrlSyncRef.current = false;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedKey, category, subCategory, childCategory]);

//   const resolveContent = (key) => {
//     if (!key) return null;

//     if (key.startsWith("cat_")) {
//       const catId = key.replace("cat_", "");
//       const cat = category.find((c) => String(c.id) === catId);
//       const subCats = getSubCategoriesForCategory(catId);

//       // If category has sub-categories → show hint only, never show category-level items
//       if (subCats.length > 0) {
//         return {
//           title: cat?.name,
//           items: [],
//           isNumeral: cat ? isNumeralCat(cat) : false,
//           isPuspika: cat ? isPuspikaCat(cat) : false,
//           isCitra: cat ? isCitraCat(cat) : false,
//           hint: "Select a sub-section from the left to view items.",
//         };
//       }

//       // No sub-categories → show direct items
//       const directItems = filteredPalaeographical
//         .filter(
//           (item) =>
//             sameId(item.category_id, catId) &&
//             item.sub_category_id == null &&
//             item.child_category_id == null,
//         )
//         .sort(
//           (a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0),
//         );

//       return {
//         title: cat?.name,
//         items: directItems,
//         isNumeral: cat ? isNumeralCat(cat) : false,
//         isPuspika: cat ? isPuspikaCat(cat) : false,
//         isCitra: cat ? isCitraCat(cat) : false,
//       };
//     }

//     if (key.startsWith("sub_")) {
//       const subId = key.replace("sub_", "");
//       const sc = subCategory.find((s) => String(s.id) === subId);
//       const parentCat = category.find((c) => sameId(c.id, sc?.category_id));
//       const childCats = getChildCategoriesForSubCategory(subId);

//       // If sub-category has child categories → show hint only, never show sub-level items
//       if (childCats.length > 0) {
//         return {
//           title: sc?.name,
//           items: [],
//           isNumeral: parentCat ? isNumeralCat(parentCat) : false,
//           isPuspika: parentCat ? isPuspikaCat(parentCat) : false,
//           isCitra: parentCat ? isCitraCat(parentCat) : false,
//           hint: "Select a sub-section from the left to view items.",
//         };
//       }

//       // No child categories → show direct items
//       const items = filteredPalaeographical.filter((p) =>
//         sameId(p.sub_category_id, subId),
//       );

//       return {
//         title: sc?.name,
//         items,
//         isNumeral: parentCat ? isNumeralCat(parentCat) : false,
//         isPuspika: parentCat ? isPuspikaCat(parentCat) : false,
//         isCitra: parentCat ? isCitraCat(parentCat) : false,
//       };
//     }

//     if (key.startsWith("child_")) {
//       const childId = key.replace("child_", "");

//       // Look up the child category from state first, then fall back to embedded objects
//       const cc =
//         childCategory.find((c) => String(c.id) === childId) ||
//         filteredPalaeographical
//           .find((p) => sameId(p.child_category?.id, childId))?.child_category;

//       const parentSub = subCategory.find((s) =>
//         sameId(s.id, cc?.sub_category_id),
//       );
//       const parentCat = category.find((c) =>
//         sameId(c.id, parentSub?.category_id),
//       );

//       const items = filteredPalaeographical.filter(
//         (p) =>
//           sameId(p.child_category_id, childId) ||
//           sameId(p.child_category?.id, childId),
//       );

//       return {
//         title: cc?.name,
//         items,
//         isNumeral: parentCat ? isNumeralCat(parentCat) : false,
//         isPuspika: parentCat ? isPuspikaCat(parentCat) : false,
//         isCitra: parentCat ? isCitraCat(parentCat) : false,
//       };
//     }

//     return null;
//   };
//   const content = resolveContent(selectedKey);
//   const useLargeBoxes = content ? content.isPuspika || content.isCitra : false;

//   const handleTreeSelect = (key, options = {}) => {
//     setSelectedKey(key);
//     const nextOpenPath =
//       options.hasChildren && options.isOpen
//         ? getClosedPathForNode(key)
//         : getOpenPathForNode(key, options);

//     setOpenKeys(new Set(nextOpenPath));

//     if (drawerOpen && !options.hasChildren) {
//       setDrawerOpen(false);
//     }
//   };

//   const handleFilterChange = (key, value) =>
//     setFilters((prev) => ({ ...prev, [key]: value }));

//   const resetFilters = () =>
//     setFilters({
//       period: "All",
//       script: "All",
//       varna: "All",
//       symbols: "All",
//       citra: "All",
//     });

//   const sidebarProps = {
//     sortedCategories,
//     getSubCategoriesForCategory,
//     getChildCategoriesForSubCategory,
//     selectedKey,
//     onSelect: handleTreeSelect,
//     openKeys,
//   };

//   // Derive current category label for the mobile header button
//   const selectedLabel = (() => {
//     if (!selectedKey || !content?.title) return "Select Category";
//     return content.title.length > 22
//       ? content.title.slice(0, 22) + "…"
//       : content.title;
//   })();

//   return (
//     <>
//       {/* Hero Banner */}
//       <div className="relative h-[40vh] sm:h-[50vh] mt-12 flex items-center justify-center">
//         <img
//           src="/images/inscription/main.jpg"
//           alt="Inscriptions"
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black/40"></div>
//         <div className="absolute top-16 left-4 sm:left-6 z-10 text-white p-3 flex items-center gap-2 text-sm sm:text-base leading-6 tracking-wide">
//           <Link href="/" className="hover:underline">
//             Home
//           </Link>
//           <span>/</span>
//           <span className="opacity-80">Palaeographical Database</span>
//         </div>
//         <h1 className="relative px-4 z-10 text-2xl sm:text-4xl md:text-5xl text-white font-semibold text-center leading-tight">
//           Palaeographical Database of Inscriptions
//         </h1>
//       </div>

//       {/* Intro */}
//       <div className="px-6 lg:px-20 mx-auto py-10 sm:py-16">
//         <h2 className="text-xl sm:text-3xl font-semibold mb-4">
//           Database of Palaeographical and Visual Features of Inscriptions
//         </h2>
//         <p className="text-base sm:text-lg mb-8 text-justify">
//           Inscriptions are among the earliest forms of writing in human
//           civilisation. This initiative aims to bring together palaeographic
//           research to build a comprehensive, evolving repository of
//           inscriptional features from Nepal across key historical periods,
//           including the Licchavi, Malla, and Shah/Rana eras. The project enables
//           both scholars and the wider public to explore, compare, and analyse
//           inscriptions from the region. By examining dated and undated materials
//           side by side, readers can better identify stylistic characteristics
//           and historical patterns. Alongside textual analysis, the study also sheds
//           light on craftsmanship, production techniques, usage contexts, and
//           intellectual traditions, with particular attention to the evolution of
//           scripts and visual paratextual elements.
//         </p>

//         <div className="max-w-3xl mx-auto px-4 pb-10 sm:pb-12 text-center text-sm leading-relaxed">
//           <p className="font-medium break-words">
//             नातिकृशैर्नातिदीर्घैर्ह्रस्वदीर्घादिलक्षितैः ।
//           </p>
//           <p className="font-medium break-words">
//             सम्पूर्णावयवैर्मात्राबिन्दुसंयोगलक्षितै: ॥
//           </p>
//           <p>nātikṛśair nātidīrghair hrasvadīrghādilakṣitaiḥ |</p>
//           <p>sampūrṇāvayavair mātrābindusaṃyogalakṣitaiḥ ||</p>
//           <p className="mt-2">
//             [The letters should not be] too broad or too thin,{" "}
//             <br className="hidden sm:block" />
//             the short and long vowel signs [should be] marked [properly],{" "}
//             <br className="hidden sm:block" />
//             all parts [of the letters should be] inscribed [fully],{" "}
//             <br className="hidden sm:block" />
//             [and] the dots and conjunctions [should be] marked [clearly].
//           </p>
//           <p className="text-xs mt-3 text-gray-600">
//             (<span className="italic">Hayaśīrṣapañcarātra,</span> 2.31.11)
//           </p>
//           <div className="mt-4 flex justify-center">
//             <div className="cursor-pointer w-full sm:w-3/4">
//               <audio controls controlsList="nodownload" className="w-full">
//                 <source src="/images/database.wav" type="audio/mpeg" />
//                 Your browser does not support the audio element.
//               </audio>
//             </div>
//           </div>
//         </div>

//         <h2 className="mb-6 sm:mb-8 text-lg sm:text-2xl text-center">
//           Our database is under development and continues to expand as new
//           materials are added on ongoing basis. Visit and explore the
//           collection!
//         </h2>

//         {/* Filters */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 mb-6">
//           {[
//             { key: "period", label: "Period", allLabel: "All Periods" },
//             { key: "script", label: "Script", allLabel: "All Scripts" },
//             { key: "varna", label: "Varṇa", allLabel: "All Varṇa" },
//             {
//               key: "symbols",
//               label: "Symbols, Signs",
//               allLabel: "All Symbols",
//             },
//             { key: "citra", label: "Citra (figures)", allLabel: "All Citra" },
//           ].map(({ key, label, allLabel }) => (
//             <div key={key}>
//               <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
//                 {label}
//               </label>
//               <select
//                 className="border cursor-pointer p-2 sm:p-3 rounded w-full text-sm"
//                 value={filters[key]}
//                 onChange={(e) => handleFilterChange(key, e.target.value)}>
//                 {unique(key).map((v) => (
//                   <option key={v} value={v}>
//                     {v === "All" ? allLabel : v}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-end mb-8 sm:mb-10">
//           <button
//             onClick={resetFilters}
//             className="px-4 sm:px-6 py-2 border cursor-pointer rounded text-sm hover:bg-gray-100 transition">
//             Reset Filters
//           </button>
//         </div>
//       </div>

//       {/* ── Two-Panel Layout ─────────────────────────────────────────────────── */}
//       <div className="px-6 lg:px-20 mx-auto pb-24">
//         {/* Mobile/Tablet: Category toggle button */}
//         <div className="lg:hidden mb-4">
//           <button
//             onClick={() => setDrawerOpen(true)}
//             className="flex items-center gap-2 px-4 py-2.5 bg-[#50644b] text-white text-sm font-medium rounded-lg shadow-sm w-full sm:w-auto">
//             {/* Hamburger icon */}
//             <svg
//               width="18"
//               height="18"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
//               />
//             </svg>
//             <span>Categories</span>
//             {selectedKey && content?.title && (
//               <>
//                 <span className="opacity-50 mx-1">·</span>
//                 <span className="opacity-80 truncate">{selectedLabel}</span>
//               </>
//             )}
//           </button>
//         </div>

//         <div className="flex gap-6 lg:gap-16 min-h-[500px] lg:min-h-[600px]">
//           {/* ── Left: Desktop Sidebar ───────────────────────────────────────── */}
//           <aside className="hidden lg:block w-96 shrink-0 border border-gray-200 rounded-lg overflow-y-auto self-start sticky top-4 ">
//             <SidebarContent {...sidebarProps} />
//           </aside>

//           {/* ── Right: Content Panel ──────────────────────────────────────── */}
//           <div
//             ref={contentPanelRef}
//             className="flex-1 p-4 sm:p-6 overflow-y-auto border border-gray-200 rounded-lg min-w-0 max-h-[80vh] self-start lg:sticky top-24">
//             {!selectedKey ? (
//               <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 gap-3 py-16 sm:py-20">
//                 <svg
//                   width="48"
//                   height="48"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="1.5"
//                   viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
//                   />
//                 </svg>
//                 <p className="text-base sm:text-lg font-medium">
//                   Select a category
//                 </p>
//                 <p className="text-sm max-w-xs">
//                   {window.innerWidth < 1024
//                     ? 'Tap "Categories" above to browse.'
//                     : "Click on any category, sub-category, or section to view its palaeographical items."}
//                 </p>
//               </div>
//             ) : content ? (
//               <>
//                 <h3 className="text-xl font-poppins sm:text-2xl font-semibold mb-4 sm:mb-6">
//                  <span className="font-poppins"> {content.title}</span>
//                 </h3>

//                 {content.hint && (
//                   <p className="text-sm text-gray-500 italic mb-4 sm:mb-6">
//                     {content.hint}
//                   </p>
//                 )}

//                 <div className="flex flex-wrap gap-3 sm:gap-6">
//                   {content.items.length > 0
//                     ? content.isNumeral
//                       ? sortNumeralItems(content.items).map((item) => (
//                           <NumeralBox key={item.id} item={item} size="medium" />
//                         ))
//                       : (() => {
//                           const sortedItems = sortPalaeographicalItems(content.items);
//                           const groupWidthCh = useLargeBoxes
//                             ? null
//                             : computeUniformWidthCh(
//                                 sortedItems.map(
//                                   (item) => item.image_name || item.name || "Untitled",
//                                 ),
//                               );
//                           return sortedItems.map((item) => (
//                             <CharacterBox
//                               key={item.id}
//                               image={item.image}
//                               label={item.image_name || item.name || "Untitled"}
//                               link={item.url || null}
//                               hasData={true}
//                               large={useLargeBoxes}
//                               widthCh={groupWidthCh}
//                             />
//                           ));
//                         })()
//                     : !content.hint && (
//                         <CharacterBox
//                           label={`${content.title} (In preparation)`}
//                           hasData={false}
//                           large={useLargeBoxes}
//                         />
//                       )}
//                 </div>
//               </>
//             ) : (
//               <CharacterBox label="In preparation" hasData={false} />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ── Mobile Drawer Overlay ──────────────────────────────────────────── */}
//       {drawerOpen && (
//         <div className="fixed inset-0 z-50 lg:hidden">
//           {/* Backdrop */}
//           <div
//             className="absolute inset-0 bg-black/50 transition-opacity"
//             onClick={() => setDrawerOpen(false)}
//           />

//           {/* Drawer panel */}
//           <div
//             ref={drawerRef}
//             className="absolute top-12 left-0 bottom-0 w-[280px] sm:w-[320px] backdrop-blur-lg shadow-2xl flex flex-col overflow-hidden"
//             style={{ animation: "slideInLeft 0.25s ease-out" }}>
//             {/* Drawer header with close button */}
//             <div className="flex items-center justify-between px-4 py-3 bg-[#50644b] shrink-0">
//               <span className="text-white font-semibold text-sm tracking-wide uppercase">
//                 Categories
//               </span>
//               <button
//                 onClick={() => setDrawerOpen(false)}
//                 className="text-white/80 hover:text-white transition-colors p-1 rounded"
//                 aria-label="Close categories">
//                 <svg
//                   width="20"
//                   height="20"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>

//             {/* Scrollable tree */}
//             <div className="flex-1 min-h-0 overflow-y-auto pb-6">
//               <SidebarContent {...sidebarProps} />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Drawer animation keyframe */}
//       <style>{`
//         @keyframes slideInLeft {
//           from { transform: translateX(-100%); }
//           to   { transform: translateX(0); }
//         }
//       `}</style>
//     </>
//   );
// };

// Palaeographical.layout = (page) => <GuestLayout>{page}</GuestLayout>;

// export default Palaeographical;