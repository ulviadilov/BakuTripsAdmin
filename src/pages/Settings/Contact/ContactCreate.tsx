import * as yup from 'yup'
import { useForm, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Input from '../../../components/Input'
import { contactService } from '../../../services/settings/contact'
import { otherLanguages } from '../../../constants'
import { useState } from 'react'
import { useFormDraft, clearDraft } from '../../../utils/draft'

const schema = yup.object().shape({
    displayOrder: yup.number().required("Display order is required").min(0, "Display order must be 0 or greater"),
    corporateNumber: yup.string().required("Corporate number is required"),
    corporateMail: yup.string().email("Invalid email format").required("Corporate email is required"),
    location: yup.string().required("Location is required"),
    workingHours: yup.string().required("Working hours are required"),
    mapUrl: yup.string().required("Map URL is required")
})

type FormData = yup.InferType<typeof schema>
type TranslationItem = { languageCode: string; location: string; workingHours: string }

export default function ContactCreate() {
    const navigate = useNavigate()

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            displayOrder: 0,
            corporateNumber: '',
            corporateMail: '',
            location: '',
            workingHours: '',
            mapUrl: ''
        }
    })

    // Persist contact draft
    useFormDraft<FormData>('create:contact', { reset, watch });

    const { fields: translationFields, append } = useFieldArray({ name: 'translations' as any, control: control as any })
    const [activeLang, setActiveLang] = useState<string>(otherLanguages[0]?.code || 'az')
    // Seed translations (not in schema type, but we pass along)
    if (translationFields.length === 0 && otherLanguages.length > 0) {
        otherLanguages.forEach(l => append({ languageCode: l.code, location: '', workingHours: '' } as unknown as TranslationItem))
    }

    const mutation = useMutation({
        mutationFn: contactService.create,
        onSuccess: () => {
            toast.success('Contact created successfully');
            clearDraft('create:contact');
        },
        onError: (error) => {
            console.log(error)
            toast.error('Failed to create contact');
        }
    })

    const onSubmit = async (data: FormData) => {
        const srcMatch = data.mapUrl.match(/src="([^"]+)"/);
        const extractedSrc = srcMatch ? srcMatch[1] : '';
        const payload = {
            ...data,
            mapUrl: extractedSrc,
            translations: (translationFields as any[]).map((_: any, idx: number) => ({
                languageCode: otherLanguages[idx]?.code,
                location: (control._formValues as any)?.translations?.[idx]?.location || '',
                workingHours: (control._formValues as any)?.translations?.[idx]?.workingHours || ''
            }))
        }
        mutation.mutate(payload)
    }

    const handleBack = () => {
        navigate('/contact')
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Go back"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Create Contact</h1>
                        <p className="text-gray-600 text-sm mt-1">Add a new contact information</p>
                    </div>
                </div>
            </div>

            {/* Form */}
        <div className="max-w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        name="displayOrder"
                        control={control}
                        label="Display Order"
                        type="number"
                        placeholder="Enter display order"
                        required={true}
                        error={errors.displayOrder?.message}
                    />

                    <Input
                        name="corporateNumber"
                        control={control}
                        label="Corporate Number"
                        type="text"
                        placeholder="Enter corporate number"
                        required={true}
                        error={errors.corporateNumber?.message}
                    />

                    <Input
                        name="corporateMail"
                        control={control}
                        label="Corporate Email"
                        type="email"
                        placeholder="Enter corporate email"
                        required={true}
                        error={errors.corporateMail?.message}
                    />

                    <Input
                        name="location"
                        control={control}
                        label="Location"
                        type="text"
                        placeholder="Enter location"
                        required={true}
                        error={errors.location?.message}
                    />

                    <Input
                        name="workingHours"
                        control={control}
                        label="Working Hours"
                        type="text"
                        placeholder="Enter working hours (e.g., Mon-Fri 9:00-18:00)"
                        required={true}
                        error={errors.workingHours?.message}
                    />

                    <Input
                        name="mapUrl"
                        control={control}
                        label="Map URL"
                        type="text"
                        placeholder="Enter map URL"
                        required={true}
                        error={errors.mapUrl?.message}
                    />

                    {/* Translations Section */}
                    {otherLanguages.length > 0 && (
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Translations</h3>
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                    {otherLanguages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            onClick={() => setActiveLang(lang.code)}
                                            className={`${activeLang === lang.code ? "border-slate-500 text-slate-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                        >
                                            {lang.name}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="mt-6">
                                {otherLanguages.map((lang, idx) => (
                                    <div key={lang.code} style={{ display: activeLang === lang.code ? 'block' : 'none' }}>
                                        <Input name={`translations.${idx}.location`} control={control as any} label={`Location (${lang.code.toUpperCase()})`} type="text" placeholder="Enter location" />
                                        <div className="mt-4" />
                                        <Input name={`translations.${idx}.workingHours`} control={control as any} label={`Working Hours (${lang.code.toUpperCase()})`} type="text" placeholder="Enter working hours" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="pt-4 flex items-center space-x-3">
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="bg-slate-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                        >
                            {mutation.isPending ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Contact
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={mutation.isPending}
                            className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
