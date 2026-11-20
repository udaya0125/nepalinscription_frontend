// import InputError from '@/Components/InputError';
// import InputLabel from '@/Components/InputLabel';
// import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
// import GuestLayout from '@/Layouts/GuestLayout';
// import { Head, Link, useForm } from '@inertiajs/react';

// export default function Register() {
//     const { data, setData, post, processing, errors, reset } = useForm({
//         name: '',
//         email: '',
//         password: '',
//         password_confirmation: '',
//     });

//     const submit = (e) => {
//         e.preventDefault();

//         post(route('register'), {
//             onFinish: () => reset('password', 'password_confirmation'),
//         });
//     };

//     return (
//         <GuestLayout>
//             <Head title="Register" />

//             <form onSubmit={submit}>
//                 <div>
//                     <InputLabel htmlFor="name" value="Name" />

//                     <TextInput
//                         id="name"
//                         name="name"
//                         value={data.name}
//                         className="mt-1 block w-full"
//                         autoComplete="name"
//                         isFocused={true}
//                         onChange={(e) => setData('name', e.target.value)}
//                         required
//                     />

//                     <InputError message={errors.name} className="mt-2" />
//                 </div>

//                 <div className="mt-4">
//                     <InputLabel htmlFor="email" value="Email" />

//                     <TextInput
//                         id="email"
//                         type="email"
//                         name="email"
//                         value={data.email}
//                         className="mt-1 block w-full"
//                         autoComplete="username"
//                         onChange={(e) => setData('email', e.target.value)}
//                         required
//                     />

//                     <InputError message={errors.email} className="mt-2" />
//                 </div>

//                 <div className="mt-4">
//                     <InputLabel htmlFor="password" value="Password" />

//                     <TextInput
//                         id="password"
//                         type="password"
//                         name="password"
//                         value={data.password}
//                         className="mt-1 block w-full"
//                         autoComplete="new-password"
//                         onChange={(e) => setData('password', e.target.value)}
//                         required
//                     />

//                     <InputError message={errors.password} className="mt-2" />
//                 </div>

//                 <div className="mt-4">
//                     <InputLabel
//                         htmlFor="password_confirmation"
//                         value="Confirm Password"
//                     />

//                     <TextInput
//                         id="password_confirmation"
//                         type="password"
//                         name="password_confirmation"
//                         value={data.password_confirmation}
//                         className="mt-1 block w-full"
//                         autoComplete="new-password"
//                         onChange={(e) =>
//                             setData('password_confirmation', e.target.value)
//                         }
//                         required
//                     />

//                     <InputError
//                         message={errors.password_confirmation}
//                         className="mt-2"
//                     />
//                 </div>

//                 <div className="mt-4 flex items-center justify-end">
//                     <Link
//                         href={route('login')}
//                         className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                     >
//                         Already registered?
//                     </Link>

//                     <PrimaryButton className="ms-4" disabled={processing}>
//                         Register
//                     </PrimaryButton>
//                 </div>
//             </form>
//         </GuestLayout>
//     );
// }




import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

function EyeIcon({ open }) {
    return open ? (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
        >
            <path d="M3 3l18 18" />
            <path d="M10.6 10.6a2 2 0 002.8 2.8" />
            <path d="M9.9 5.1A9.8 9.8 0 0112 5c5 0 9 4.5 10 7a11.6 11.6 0 01-3.2 4.2M6.6 6.6A11.7 11.7 0 002 12c1 2.5 5 7 10 7a9.7 9.7 0 004.4-1" />
        </svg>
    ) : (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
        >
            <path d="M2 12c1-2.5 5-7 10-7s9 4.5 10 7c-1 2.5-5 7-10 7S3 14.5 2 12z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        city: '',
        country: '',
        affiliated_institution: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />

            <div className="flex min-h-screen items-center justify-center px-4 py-12">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg sm:p-10">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Create your account
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Fill in your details to get started.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="name" value="Name" />

                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1.5 block w-full rounded-lg border-gray-300 py-2.5 shadow-sm"
                                autoComplete="name"
                                isFocused={true}
                                placeholder="Your full name"
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                required
                            />

                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1.5 block w-full rounded-lg border-gray-300 py-2.5 shadow-sm"
                                autoComplete="username"
                                placeholder="you@example.com"
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                required
                            />

                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="city" value="City" />

                                <TextInput
                                    id="city"
                                    name="city"
                                    value={data.city}
                                    className="mt-1.5 block w-full rounded-lg border-gray-300 py-2.5 shadow-sm"
                                    autoComplete="address-level2"
                                    placeholder="Your city"
                                    onChange={(e) =>
                                        setData('city', e.target.value)
                                    }
                                    required
                                />

                                <InputError
                                    message={errors.city}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="country" value="Country" />

                                <TextInput
                                    id="country"
                                    name="country"
                                    value={data.country}
                                    className="mt-1.5 block w-full rounded-lg border-gray-300 py-2.5 shadow-sm"
                                    autoComplete="country-name"
                                    placeholder="Your country"
                                    onChange={(e) =>
                                        setData('country', e.target.value)
                                    }
                                    required
                                />

                                <InputError
                                    message={errors.country}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="affiliated_institution"
                                value="Affiliated institution (optional)"
                            />

                            <TextInput
                                id="affiliated_institution"
                                name="affiliated_institution"
                                value={data.affiliated_institution}
                                className="mt-1.5 block w-full rounded-lg border-gray-300 py-2.5 shadow-sm"
                                autoComplete="organization"
                                placeholder="University or organization"
                                onChange={(e) =>
                                    setData(
                                        'affiliated_institution',
                                        e.target.value,
                                    )
                                }
                            />

                            <InputError
                                message={errors.affiliated_institution}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password" />

                            <div className="relative mt-1.5">
                                <TextInput
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    className="block w-full rounded-lg border-gray-300 py-2.5 pr-11 shadow-sm"
                                    autoComplete="new-password"
                                    placeholder="Create a password"
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3 text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                >
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Confirm password"
                            />

                            <div className="relative mt-1.5">
                                <TextInput
                                    id="password_confirmation"
                                    type={showConfirmation ? 'text' : 'password'}
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="block w-full rounded-lg border-gray-300 py-2.5 pr-11 shadow-sm"
                                    autoComplete="new-password"
                                    placeholder="Re-enter your password"
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmation((prev) => !prev)
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3 text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                    aria-label={
                                        showConfirmation
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                >
                                    <EyeIcon open={showConfirmation} />
                                </button>
                            </div>

                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="terms"
                                className="flex cursor-pointer items-start gap-3"
                            >
                                <input
                                    id="terms"
                                    type="checkbox"
                                    name="terms"
                                    checked={data.terms}
                                    onChange={(e) =>
                                        setData('terms', e.target.checked)
                                    }
                                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                    required
                                />
                                <span className="text-sm text-gray-600">
                                    I accept the{' '}
                                    <a
                                        href="/terms"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded font-semibold text-indigo-600 hover:text-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                    >
                                        terms and conditions
                                    </a>
                                </span>
                            </label>

                            <InputError
                                message={errors.terms}
                                className="mt-2"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing || !data.terms}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing && (
                                <svg
                                    className="h-4 w-4 animate-spin"
                                    viewBox="0 0 24 24"
                                    fill="none"
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
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    />
                                </svg>
                            )}
                            {processing ? 'Creating account…' : 'Register'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link
                            href={route('login')}
                            className="rounded font-semibold text-indigo-600 hover:text-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}



// import InputError from '@/Components/InputError';
// import InputLabel from '@/Components/InputLabel';
// import TextInput from '@/Components/TextInput';
// import { Head, Link, useForm } from '@inertiajs/react';
// import { useState } from 'react';

// function EyeIcon({ open }) {
//     return open ? (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="1.8"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className="h-5 w-5"
//         >
//             <path d="M3 3l18 18" />
//             <path d="M10.6 10.6a2 2 0 002.8 2.8" />
//             <path d="M9.9 5.1A9.8 9.8 0 0112 5c5 0 9 4.5 10 7a11.6 11.6 0 01-3.2 4.2M6.6 6.6A11.7 11.7 0 002 12c1 2.5 5 7 10 7a9.7 9.7 0 004.4-1" />
//         </svg>
//     ) : (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="1.8"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className="h-5 w-5"
//         >
//             <path d="M2 12c1-2.5 5-7 10-7s9 4.5 10 7c-1 2.5-5 7-10 7S3 14.5 2 12z" />
//             <circle cx="12" cy="12" r="3" />
//         </svg>
//     );
// }

// export default function Register() {
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmation, setShowConfirmation] = useState(false);

//     const { data, setData, post, processing, errors, reset } = useForm({
//         name: '',
//         email: '',
//         city: '',
//         country: '',
//         affiliated_institution: '',
//         password: '',
//         password_confirmation: '',
//     });

//     const submit = (e) => {
//         e.preventDefault();

//         post(route('register'), {
//             onFinish: () => reset('password', 'password_confirmation'),
//         });
//     };

//     return (
//         <>
//             <Head title="Register" />

//             <div className="flex min-h-screen items-center justify-center px-4 py-12">
//                 <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg sm:p-10">
//                     <div className="mb-8 text-center">
//                         <h1 className="text-2xl font-semibold text-gray-900">
//                             Create your account
//                         </h1>
//                         <p className="mt-2 text-sm text-gray-500">
//                             Fill in your details to get started.
//                         </p>
//                     </div>

//                     <form onSubmit={submit} className="space-y-5">
//                         <div>
//                             <InputLabel htmlFor="name" value="Name" />

//                             <TextInput
//                                 id="name"
//                                 name="name"
//                                 value={data.name}
//                                 className="mt-1.5 block w-full rounded-lg border-gray-300 py-2.5 shadow-sm"
//                                 autoComplete="name"
//                                 isFocused={true}
//                                 placeholder="Your full name"
//                                 onChange={(e) =>
//                                     setData('name', e.target.value)
//                                 }
//                                 required
//                             />

//                             <InputError
//                                 message={errors.name}
//                                 className="mt-2"
//                             />
//                         </div>

//                         <div>
//                             <InputLabel htmlFor="email" value="Email" />

//                             <TextInput
//                                 id="email"
//                                 type="email"
//                                 name="email"
//                                 value={data.email}
//                                 className="mt-1.5 block w-full rounded-lg border-gray-300 py-2.5 shadow-sm"
//                                 autoComplete="username"
//                                 placeholder="you@example.com"
//                                 onChange={(e) =>
//                                     setData('email', e.target.value)
//                                 }
//                                 required
//                             />

//                             <InputError
//                                 message={errors.email}
//                                 className="mt-2"
//                             />
//                         </div>

//                         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//                             <div>
//                                 <InputLabel htmlFor="city" value="City" />

//                                 <TextInput
//                                     id="city"
//                                     name="city"
//                                     value={data.city}
//                                     className="mt-1.5 block w-full rounded-lg border-gray-300 py-2.5 shadow-sm"
//                                     autoComplete="address-level2"
//                                     placeholder="Your city"
//                                     onChange={(e) =>
//                                         setData('city', e.target.value)
//                                     }
//                                     required
//                                 />

//                                 <InputError
//                                     message={errors.city}
//                                     className="mt-2"
//                                 />
//                             </div>

//                             <div>
//                                 <InputLabel htmlFor="country" value="Country" />

//                                 <TextInput
//                                     id="country"
//                                     name="country"
//                                     value={data.country}
//                                     className="mt-1.5 block w-full rounded-lg border-gray-300 py-2.5 shadow-sm"
//                                     autoComplete="country-name"
//                                     placeholder="Your country"
//                                     onChange={(e) =>
//                                         setData('country', e.target.value)
//                                     }
//                                     required
//                                 />

//                                 <InputError
//                                     message={errors.country}
//                                     className="mt-2"
//                                 />
//                             </div>
//                         </div>

//                         <div>
//                             <InputLabel
//                                 htmlFor="affiliated_institution"
//                                 value="Affiliated institution (optional)"
//                             />

//                             <TextInput
//                                 id="affiliated_institution"
//                                 name="affiliated_institution"
//                                 value={data.affiliated_institution}
//                                 className="mt-1.5 block w-full rounded-lg border-gray-300 py-2.5 shadow-sm"
//                                 autoComplete="organization"
//                                 placeholder="University or organization"
//                                 onChange={(e) =>
//                                     setData(
//                                         'affiliated_institution',
//                                         e.target.value,
//                                     )
//                                 }
//                             />

//                             <InputError
//                                 message={errors.affiliated_institution}
//                                 className="mt-2"
//                             />
//                         </div>

//                         <div>
//                             <InputLabel htmlFor="password" value="Password" />

//                             <div className="relative mt-1.5">
//                                 <TextInput
//                                     id="password"
//                                     type={showPassword ? 'text' : 'password'}
//                                     name="password"
//                                     value={data.password}
//                                     className="block w-full rounded-lg border-gray-300 py-2.5 pr-11 shadow-sm"
//                                     autoComplete="new-password"
//                                     placeholder="Create a password"
//                                     onChange={(e) =>
//                                         setData('password', e.target.value)
//                                     }
//                                     required
//                                 />

//                                 <button
//                                     type="button"
//                                     onClick={() =>
//                                         setShowPassword((prev) => !prev)
//                                     }
//                                     className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3 text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
//                                     aria-label={
//                                         showPassword
//                                             ? 'Hide password'
//                                             : 'Show password'
//                                     }
//                                 >
//                                     <EyeIcon open={showPassword} />
//                                 </button>
//                             </div>

//                             <InputError
//                                 message={errors.password}
//                                 className="mt-2"
//                             />
//                         </div>

//                         <div>
//                             <InputLabel
//                                 htmlFor="password_confirmation"
//                                 value="Confirm password"
//                             />

//                             <div className="relative mt-1.5">
//                                 <TextInput
//                                     id="password_confirmation"
//                                     type={showConfirmation ? 'text' : 'password'}
//                                     name="password_confirmation"
//                                     value={data.password_confirmation}
//                                     className="block w-full rounded-lg border-gray-300 py-2.5 pr-11 shadow-sm"
//                                     autoComplete="new-password"
//                                     placeholder="Re-enter your password"
//                                     onChange={(e) =>
//                                         setData(
//                                             'password_confirmation',
//                                             e.target.value,
//                                         )
//                                     }
//                                     required
//                                 />

//                                 <button
//                                     type="button"
//                                     onClick={() =>
//                                         setShowConfirmation((prev) => !prev)
//                                     }
//                                     className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3 text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
//                                     aria-label={
//                                         showConfirmation
//                                             ? 'Hide password'
//                                             : 'Show password'
//                                     }
//                                 >
//                                     <EyeIcon open={showConfirmation} />
//                                 </button>
//                             </div>

//                             <InputError
//                                 message={errors.password_confirmation}
//                                 className="mt-2"
//                             />
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={processing}
//                             className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
//                         >
//                             {processing && (
//                                 <svg
//                                     className="h-4 w-4 animate-spin"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                 >
//                                     <circle
//                                         className="opacity-25"
//                                         cx="12"
//                                         cy="12"
//                                         r="10"
//                                         stroke="currentColor"
//                                         strokeWidth="4"
//                                     />
//                                     <path
//                                         className="opacity-75"
//                                         fill="currentColor"
//                                         d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                                     />
//                                 </svg>
//                             )}
//                             {processing ? 'Creating account…' : 'Register'}
//                         </button>
//                     </form>

//                     <p className="mt-8 text-center text-sm text-gray-500">
//                         Already have an account?{' '}
//                         <Link
//                             href={route('login')}
//                             className="rounded font-semibold text-indigo-600 hover:text-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
//                         >
//                             Log in
//                         </Link>
//                     </p>
//                 </div>
//             </div>
//         </>
//     );
// }
