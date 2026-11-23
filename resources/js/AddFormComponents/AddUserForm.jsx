// import axios from "axios";
// import { Camera, Eye, EyeOff, X } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import Select from "react-select";

// const ROLE_OPTIONS = [
//     { value: "user", label: "User" },
//     { value: "admin", label: "Admin" },
// ];

// const STATUS_OPTIONS = [
//     { value: "pending", label: "Pending" },
//     { value: "approved", label: "Approved" },
//     { value: "rejected", label: "Rejected" },
// ];

// const ALLOWED_IMAGE_TYPES = [
//     "image/png",
//     "image/jpeg",
//     "image/gif",
//     "image/webp",
// ];
// const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB, matches the controller's max:2048

// const emptyForm = {
//     name: "",
//     email: "",
//     password: "",
//     password_confirmation: "",
//     city: "",
//     country: "",
//     role: "user",
//     affiliated_institution: "",
//     is_approved: "pending",
//     image: null,
// };

// const inputClass =
//     "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50";

// const selectStyles = (hasError) => ({
//     control: (base, state) => ({
//         ...base,
//         minHeight: "44px",
//         borderRadius: "0.75rem",
//         borderColor: state.isFocused
//             ? "#3b82f6"
//             : hasError
//               ? "#ef4444"
//               : "#d1d5db",
//         boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
//         "&:hover": {
//             borderColor: state.isFocused
//                 ? "#3b82f6"
//                 : hasError
//                   ? "#ef4444"
//                   : "#d1d5db",
//         },
//     }),
//     indicatorSeparator: (base) => ({
//         ...base,
//         display: "none",
//     }),
//     // The modal scrolls and is z-50, so the portaled menu must sit above it
//     menuPortal: (base) => ({ ...base, zIndex: 9999 }),
// });

// const Label = ({ children, required }) => (
//     <label className="mb-1 block text-sm font-medium text-gray-700">
//         {children} {required && <span className="text-red-500">*</span>}
//     </label>
// );

// const ErrorText = ({ error }) =>
//     error ? <p className="mt-1 text-sm text-red-600">{error.message}</p> : null;

// // Defined OUTSIDE the main component so it is not remounted on every keystroke
// const TextField = ({
//     label,
//     required,
//     error,
//     registration,
//     disabled,
//     className = "",
//     ...rest
// }) => (
//     <div className={className}>
//         <Label required={required}>{label}</Label>
//         <input
//             {...registration}
//             {...rest}
//             disabled={disabled}
//             className={`${inputClass} ${error ? "border-red-400" : ""}`}
//         />
//         <ErrorText error={error} />
//     </div>
// );

// const PasswordField = ({
//     label,
//     required,
//     error,
//     registration,
//     disabled,
//     className = "",
// }) => {
//     const [visible, setVisible] = useState(false);

//     return (
//         <div className={className}>
//             <Label required={required}>{label}</Label>
//             <div className="relative">
//                 <input
//                     type={visible ? "text" : "password"}
//                     {...registration}
//                     disabled={disabled}
//                     autoComplete="new-password"
//                     className={`${inputClass} pr-10 ${error ? "border-red-400" : ""}`}
//                 />
//                 <button
//                     type="button"
//                     onClick={() => setVisible((v) => !v)}
//                     disabled={disabled}
//                     className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
//                     aria-label={visible ? "Hide password" : "Show password"}
//                 >
//                     {visible ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//             </div>
//             <ErrorText error={error} />
//         </div>
//     );
// };

// const SelectField = ({
//     label,
//     name,
//     control,
//     options,
//     required,
//     rules,
//     error,
//     disabled,
//     className = "",
// }) => (
//     <div className={className}>
//         <Label required={required}>{label}</Label>
//         <Controller
//             name={name}
//             control={control}
//             rules={rules}
//             render={({ field }) => (
//                 <Select
//                     inputId={name}
//                     options={options}
//                     value={options.find((o) => o.value === field.value) ?? null}
//                     onChange={(opt) => field.onChange(opt ? opt.value : "")}
//                     onBlur={field.onBlur}
//                     ref={field.ref}
//                     placeholder={`Select ${label}`}
//                     isSearchable={false}
//                     isDisabled={disabled}
//                     menuPortalTarget={document.body}
//                     menuPosition="fixed"
//                     styles={selectStyles(!!error)}
//                 />
//             )}
//         />
//         <ErrorText error={error} />
//     </div>
// );

// const AddUserForm = ({
//     showForm,
//     setShowForm,
//     setReloadTrigger,
//     editingUser,
//     setEditingUser,
//     handleUpdate,
// }) => {
//     const [imagePreview, setImagePreview] = useState(null);
//       const imgurl = import.meta.env.VITE_STORAGE_URL;

//     const {
//         control,
//         handleSubmit,
//         register,
//         reset,
//         setError,
//         clearErrors,
//         setValue,
//         getValues,
//         watch,
//         formState: { errors, isSubmitting },
//     } = useForm({ defaultValues: emptyForm });

//     const imageFile = watch("image");
//     const existingImageUrl = editingUser?.image
//         ? `${imgurl}/${editingUser.image}`
//         : null;
//     const displayImage = imagePreview || existingImageUrl;

//     // Lock background scroll while the modal is open
//     useEffect(() => {
//         if (!showForm) return undefined;
//         const originalOverflow = document.body.style.overflow;
//         document.body.style.overflow = "hidden";
//         return () => {
//             document.body.style.overflow = originalOverflow;
//         };
//     }, [showForm]);

//     // Build (and clean up) an object URL for the newly selected file
//     useEffect(() => {
//         if (!imageFile) {
//             setImagePreview(null);
//             return undefined;
//         }
//         const url = URL.createObjectURL(imageFile);
//         setImagePreview(url);
//         return () => URL.revokeObjectURL(url);
//     }, [imageFile]);

//     // Fill the form when opened (create or edit)
//     useEffect(() => {
//         if (!showForm) return;
//         clearErrors();
//         if (editingUser) {
//             const validRole = ROLE_OPTIONS.some((r) => r.value === editingUser.role);
//             reset({
//                 name: editingUser.name ?? "",
//                 email: editingUser.email ?? "",
//                 password: "",
//                 password_confirmation: "",
//                 city: editingUser.city ?? "",
//                 country: editingUser.country ?? "",
//                 role: validRole ? editingUser.role : "user",
//                 affiliated_institution: editingUser.affiliated_institution ?? "",
//                 is_approved: editingUser.is_approved ?? "pending",
//                 image: null,
//             });
//         } else {
//             reset(emptyForm);
//         }
//     }, [editingUser, showForm, reset, clearErrors]);

//     const closeForm = () => {
//         reset(emptyForm);
//         clearErrors();
//         setShowForm(false);
//         setEditingUser(null);
//     };

//     const handleImageChange = (event) => {
//         const file = event.target.files?.[0];
//         // Allow re-selecting the same file again
//         event.target.value = "";
//         if (!file) return;

//         if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
//             setError("image", {
//                 type: "manual",
//                 message: "Image must be a PNG, JPG, GIF or WEBP file.",
//             });
//             return;
//         }
//         if (file.size > MAX_IMAGE_SIZE) {
//             setError("image", {
//                 type: "manual",
//                 message: "Image must be 2 MB or smaller.",
//             });
//             return;
//         }

//         clearErrors("image");
//         setValue("image", file);
//     };

//     const removeSelectedImage = () => {
//         clearErrors("image");
//         setValue("image", null);
//     };

//     const handleCreate = async (formData) => {
//         await axios.post(route("ourusers.store"), formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//         });
//         setReloadTrigger((prev) => !prev);
//     };

//     const onSubmit = async (values) => {
//         const formData = new FormData();
//         formData.append("name", values.name);
//         formData.append("email", values.email);
//         formData.append("city", values.city ?? "");
//         formData.append("country", values.country ?? "");
//         formData.append("role", values.role);
//         formData.append("affiliated_institution", values.affiliated_institution ?? "");
//         formData.append("is_approved", values.is_approved);
//         if (values.password) formData.append("password", values.password);
//         if (values.image) formData.append("image", values.image);

//         try {
//             if (editingUser) {
//                 await handleUpdate(formData, editingUser.id);
//             } else {
//                 await handleCreate(formData);
//             }
//             closeForm();
//         } catch (error) {
//             if (error.response?.status === 422) {
//                 // Map Laravel validation errors onto the matching fields
//                 Object.entries(error.response.data.errors ?? {}).forEach(
//                     ([field, messages]) => {
//                         setError(field, { type: "server", message: messages[0] });
//                     },
//                 );
//             } else {
//                 console.error("Error saving user:", error);
//                 alert(
//                     error.response?.data?.message ||
//                         "Error saving user. Please try again.",
//                 );
//             }
//         }
//     };

//     if (!showForm) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//             <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white px-6 py-6 shadow-2xl">
//                 <div className="sticky top-0 z-10 mb-6 flex items-center justify-between border-b bg-white pb-4">
//                     <h2 className="text-2xl font-bold text-gray-900">
//                         {editingUser ? "Edit User" : "Add New User"}
//                     </h2>
//                     <button
//                         type="button"
//                         onClick={closeForm}
//                         className="rounded-full p-2 transition-colors hover:bg-gray-100"
//                         disabled={isSubmitting}
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 <form
//                     onSubmit={handleSubmit(onSubmit)}
//                     className="space-y-6"
//                     noValidate
//                 >
//                     {/* Avatar */}
//                     <div className="flex flex-col items-center">
//                         <div className="relative mb-4">
//                             <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg">
//                                 {displayImage ? (
//                                     <img
//                                         src={displayImage}
//                                         alt="Profile preview"
//                                         className="h-full w-full object-cover"
//                                     />
//                                 ) : (
//                                     <div className="text-center text-gray-400">
//                                         <Camera className="mx-auto mb-2 h-12 w-12" />
//                                         <span className="block text-xs">
//                                             Add Photo
//                                         </span>
//                                     </div>
//                                 )}
//                             </div>
//                             <label
//                                 htmlFor="add-user-image-upload"
//                                 className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-blue-600 p-2 text-white shadow-lg transition-colors hover:bg-blue-700"
//                             >
//                                 <Camera className="h-5 w-5" />
//                             </label>
//                             {imageFile && (
//                                 <button
//                                     type="button"
//                                     onClick={removeSelectedImage}
//                                     disabled={isSubmitting}
//                                     className="absolute right-0 top-0 rounded-full bg-red-500 p-1.5 text-white shadow-lg transition-colors hover:bg-red-600"
//                                     aria-label="Remove selected image"
//                                 >
//                                     <X className="h-4 w-4" />
//                                 </button>
//                             )}
//                             <input
//                                 id="add-user-image-upload"
//                                 type="file"
//                                 accept="image/png,image/jpeg,image/gif,image/webp"
//                                 className="hidden"
//                                 onChange={handleImageChange}
//                                 disabled={isSubmitting}
//                             />
//                         </div>
//                         <p className="text-sm text-gray-500">
//                             {editingUser
//                                 ? "Click the camera icon to replace the profile picture"
//                                 : "Click the camera icon to upload a profile picture"}
//                         </p>
//                         {errors.image && (
//                             <p className="mt-1 text-sm text-red-600">
//                                 {errors.image.message}
//                             </p>
//                         )}
//                     </div>

//                     <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                         <TextField
//                             label="Name"
//                             required
//                             disabled={isSubmitting}
//                             error={errors.name}
//                             registration={register("name", {
//                                 required: "Name is required",
//                                 maxLength: {
//                                     value: 255,
//                                     message: "Name is too long",
//                                 },
//                             })}
//                         />

//                         <TextField
//                             label="Email"
//                             type="email"
//                             required
//                             disabled={isSubmitting}
//                             error={errors.email}
//                             registration={register("email", {
//                                 required: "Email is required",
//                                 pattern: {
//                                     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                                     message: "Please enter a valid email address",
//                                 },
//                             })}
//                         />

//                         <SelectField
//                             label="Role"
//                             name="role"
//                             required
//                             control={control}
//                             options={ROLE_OPTIONS}
//                             rules={{ required: "Role is required" }}
//                             error={errors.role}
//                             disabled={isSubmitting}
//                         />

//                         <SelectField
//                             label="Status"
//                             name="is_approved"
//                             control={control}
//                             options={STATUS_OPTIONS}
//                             error={errors.is_approved}
//                             disabled={isSubmitting}
//                         />

//                         <PasswordField
//                             label={
//                                 editingUser
//                                     ? "Password (leave blank to keep)"
//                                     : "Password"
//                             }
//                             required={!editingUser}
//                             disabled={isSubmitting}
//                             error={errors.password}
//                             registration={register("password", {
//                                 required: editingUser
//                                     ? false
//                                     : "Password is required",
//                                 minLength: {
//                                     value: 8,
//                                     message:
//                                         "Password must be at least 8 characters long",
//                                 },
//                             })}
//                         />

//                         <PasswordField
//                             label="Confirm Password"
//                             required={!editingUser}
//                             disabled={isSubmitting}
//                             error={errors.password_confirmation}
//                             registration={register("password_confirmation", {
//                                 validate: (value) => {
//                                     const password = getValues("password");
//                                     if (!password && !value) return true;
//                                     if (!value)
//                                         return "Password confirmation is required";
//                                     return (
//                                         value === password ||
//                                         "Passwords do not match"
//                                     );
//                                 },
//                             })}
//                         />

//                         <TextField
//                             label="City"
//                             disabled={isSubmitting}
//                             error={errors.city}
//                             registration={register("city")}
//                         />

//                         <TextField
//                             label="Country"
//                             disabled={isSubmitting}
//                             error={errors.country}
//                             registration={register("country")}
//                         />

//                         <TextField
//                             label="Affiliated Institution"
//                             className="md:col-span-2"
//                             disabled={isSubmitting}
//                             error={errors.affiliated_institution}
//                             registration={register("affiliated_institution")}
//                         />
//                     </div>

//                     <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
//                         <button
//                             type="button"
//                             onClick={closeForm}
//                             className="rounded-full border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//                             disabled={isSubmitting}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="flex items-center rounded-full bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
//                             disabled={isSubmitting}
//                         >
//                             {isSubmitting ? (
//                                 <span className="flex items-center">
//                                     <svg
//                                         className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
//                                         fill="none"
//                                         viewBox="0 0 24 24"
//                                     >
//                                         <circle
//                                             className="opacity-25"
//                                             cx="12"
//                                             cy="12"
//                                             r="10"
//                                             stroke="currentColor"
//                                             strokeWidth="4"
//                                         />
//                                         <path
//                                             className="opacity-75"
//                                             fill="currentColor"
//                                             d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
//                                         />
//                                     </svg>
//                                     {editingUser ? "Saving..." : "Creating..."}
//                                 </span>
//                             ) : (
//                                 <span>
//                                     {editingUser ? "Update User" : "Create User"}
//                                 </span>
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddUserForm;


import axios from "axios";
import { Camera, Eye, EyeOff, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

const ROLE_OPTIONS = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
];

const STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
];

const ALLOWED_IMAGE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB

const emptyForm = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    city: "",
    country: "",
    role: "user",
    affiliated_institution: "",
    is_approved: "pending",
    image: null,
};

const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50";

const selectStyles = (hasError) => ({
    control: (base, state) => ({
        ...base,
        minHeight: "44px",
        borderRadius: "0.75rem",
        borderColor: state.isFocused
            ? "#3b82f6"
            : hasError
              ? "#ef4444"
              : "#d1d5db",
        boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
        "&:hover": {
            borderColor: state.isFocused
                ? "#3b82f6"
                : hasError
                  ? "#ef4444"
                  : "#d1d5db",
        },
    }),
    indicatorSeparator: (base) => ({
        ...base,
        display: "none",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
});

const Label = ({ children, required }) => (
    <label className="mb-1 block text-sm font-medium text-gray-700">
        {children} {required && <span className="text-red-500">*</span>}
    </label>
);

const ErrorText = ({ error }) =>
    error ? <p className="mt-1 text-sm text-red-600">{error.message}</p> : null;

const TextField = ({
    label,
    required,
    error,
    registration,
    disabled,
    className = "",
    ...rest
}) => (
    <div className={className}>
        <Label required={required}>{label}</Label>
        <input
            {...registration}
            {...rest}
            disabled={disabled}
            className={`${inputClass} ${error ? "border-red-400" : ""}`}
        />
        <ErrorText error={error} />
    </div>
);

const PasswordField = ({
    label,
    required,
    error,
    registration,
    disabled,
    className = "",
}) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className={className}>
            <Label required={required}>{label}</Label>
            <div className="relative">
                <input
                    type={visible ? "text" : "password"}
                    {...registration}
                    disabled={disabled}
                    autoComplete="new-password"
                    className={`${inputClass} pr-10 ${error ? "border-red-400" : ""}`}
                />
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    disabled={disabled}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    aria-label={visible ? "Hide password" : "Show password"}
                >
                    {visible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            <ErrorText error={error} />
        </div>
    );
};

const SelectField = ({
    label,
    name,
    control,
    options,
    required,
    rules,
    error,
    disabled,
    className = "",
}) => (
    <div className={className}>
        <Label required={required}>{label}</Label>
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field }) => (
                <Select
                    inputId={name}
                    options={options}
                    value={options.find((o) => o.value === field.value) ?? null}
                    onChange={(opt) => field.onChange(opt ? opt.value : "")}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    placeholder={`Select ${label}`}
                    isSearchable={false}
                    isDisabled={disabled}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={selectStyles(!!error)}
                />
            )}
        />
        <ErrorText error={error} />
    </div>
);

const AddUserForm = ({ showForm, setShowForm, setReloadTrigger }) => {
    const [imagePreview, setImagePreview] = useState(null);

    const {
        control,
        handleSubmit,
        register,
        reset,
        setError,
        clearErrors,
        setValue,
        getValues,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: emptyForm });

    const imageFile = watch("image");
    const displayImage = imagePreview;

    // Lock background scroll while the modal is open
    useEffect(() => {
        if (!showForm) return undefined;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [showForm]);

    // Build (and clean up) an object URL for the newly selected file
    useEffect(() => {
        if (!imageFile) {
            setImagePreview(null);
            return undefined;
        }
        const url = URL.createObjectURL(imageFile);
        setImagePreview(url);
        return () => URL.revokeObjectURL(url);
    }, [imageFile]);

    // Reset the form each time the modal opens
    useEffect(() => {
        if (!showForm) return;
        clearErrors();
        reset(emptyForm);
    }, [showForm, reset, clearErrors]);

    const closeForm = () => {
        reset(emptyForm);
        clearErrors();
        setShowForm(false);
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setError("image", {
                type: "manual",
                message: "Image must be a PNG, JPG, GIF or WEBP file.",
            });
            return;
        }
        if (file.size > MAX_IMAGE_SIZE) {
            setError("image", {
                type: "manual",
                message: "Image must be 2 MB or smaller.",
            });
            return;
        }

        clearErrors("image");
        setValue("image", file);
    };

    const removeSelectedImage = () => {
        clearErrors("image");
        setValue("image", null);
    };

    const onSubmit = async (values) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("city", values.city ?? "");
        formData.append("country", values.country ?? "");
        formData.append("role", values.role);
        formData.append("affiliated_institution", values.affiliated_institution ?? "");
        formData.append("is_approved", values.is_approved);
        if (values.password) formData.append("password", values.password);
        if (values.image) formData.append("image", values.image);

        try {
            await axios.post(route("ourusers.store"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setReloadTrigger((prev) => !prev);
            closeForm();
        } catch (error) {
            if (error.response?.status === 422) {
                Object.entries(error.response.data.errors ?? {}).forEach(
                    ([field, messages]) => {
                        setError(field, { type: "server", message: messages[0] });
                    },
                );
            } else {
                console.error("Error creating user:", error);
                alert(
                    error.response?.data?.message ||
                        "Error creating user. Please try again.",
                );
            }
        }
    };

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white px-6 py-6 shadow-2xl">
                <div className="sticky top-0 z-10 mb-6 flex items-center justify-between border-b bg-white pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Add New User
                    </h2>
                    <button
                        type="button"
                        onClick={closeForm}
                        className="rounded-full p-2 transition-colors hover:bg-gray-100"
                        disabled={isSubmitting}
                    >
                        <X size={24} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                    noValidate
                >
                    {/* Avatar */}
                    <div className="flex flex-col items-center">
                        <div className="relative mb-4">
                            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg">
                                {displayImage ? (
                                    <img
                                        src={displayImage}
                                        alt="Profile preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <Camera className="mx-auto mb-2 h-12 w-12" />
                                        <span className="block text-xs">
                                            Add Photo
                                        </span>
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor="add-user-image-upload"
                                className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-blue-600 p-2 text-white shadow-lg transition-colors hover:bg-blue-700"
                            >
                                <Camera className="h-5 w-5" />
                            </label>
                            {imageFile && (
                                <button
                                    type="button"
                                    onClick={removeSelectedImage}
                                    disabled={isSubmitting}
                                    className="absolute right-0 top-0 rounded-full bg-red-500 p-1.5 text-white shadow-lg transition-colors hover:bg-red-600"
                                    aria-label="Remove selected image"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                            <input
                                id="add-user-image-upload"
                                type="file"
                                accept="image/png,image/jpeg,image/gif,image/webp"
                                className="hidden"
                                onChange={handleImageChange}
                                disabled={isSubmitting}
                            />
                        </div>
                        <p className="text-sm text-gray-500">
                            Click the camera icon to upload a profile picture
                        </p>
                        {errors.image && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.image.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <TextField
                            label="Name"
                            required
                            disabled={isSubmitting}
                            error={errors.name}
                            registration={register("name", {
                                required: "Name is required",
                                maxLength: {
                                    value: 255,
                                    message: "Name is too long",
                                },
                            })}
                        />

                        <TextField
                            label="Email"
                            type="email"
                            required
                            disabled={isSubmitting}
                            error={errors.email}
                            registration={register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Please enter a valid email address",
                                },
                            })}
                        />

                        <SelectField
                            label="Role"
                            name="role"
                            required
                            control={control}
                            options={ROLE_OPTIONS}
                            rules={{ required: "Role is required" }}
                            error={errors.role}
                            disabled={isSubmitting}
                        />

                        <SelectField
                            label="Status"
                            name="is_approved"
                            control={control}
                            options={STATUS_OPTIONS}
                            error={errors.is_approved}
                            disabled={isSubmitting}
                        />

                        <PasswordField
                            label="Password"
                            required
                            disabled={isSubmitting}
                            error={errors.password}
                            registration={register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message:
                                        "Password must be at least 8 characters long",
                                },
                            })}
                        />

                        <PasswordField
                            label="Confirm Password"
                            required
                            disabled={isSubmitting}
                            error={errors.password_confirmation}
                            registration={register("password_confirmation", {
                                validate: (value) => {
                                    const password = getValues("password");
                                    if (!password && !value) return true;
                                    if (!value)
                                        return "Password confirmation is required";
                                    return (
                                        value === password ||
                                        "Passwords do not match"
                                    );
                                },
                            })}
                        />

                        <TextField
                            label="City"
                            disabled={isSubmitting}
                            error={errors.city}
                            registration={register("city")}
                        />

                        <TextField
                            label="Country"
                            disabled={isSubmitting}
                            error={errors.country}
                            registration={register("country")}
                        />

                        <TextField
                            label="Affiliated Institution"
                            className="md:col-span-2"
                            disabled={isSubmitting}
                            error={errors.affiliated_institution}
                            registration={register("affiliated_institution")}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
                        <button
                            type="button"
                            onClick={closeForm}
                            className="rounded-full border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center rounded-full bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <svg
                                        className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    Creating...
                                </span>
                            ) : (
                                <span>Create User</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserForm;
