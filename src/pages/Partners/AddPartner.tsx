import { useForm } from "react-hook-form";
import { FileUpload } from "../../components/FIleUpload";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import MultiSelect from "../../components/MultiSelect";
const schema = yup.object({
    name: yup.string().required("Name is required"),
    country: yup.string().required("Country is required"),
    skills: yup.array().min(1, "Select at least one skill"),
});
export default function AddPartner() {
    const {
        control,
        // handleSubmit,
        // formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const handleFilesChange = () => {};
    const skillOptions = [
        { value: "javascript", label: "JavaScript" },
        { value: "typescript", label: "TypeScript" },
        { value: "react", label: "React" },
        { value: "vue", label: "Vue.js" },
        { value: "angular", label: "Angular" },
        { value: "node", label: "Node.js" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
    ];
    return (
        <>
            <FileUpload
                accept="image/*,.pdf,.doc,.docx,.txt"
                multiple={true}
                maxSize={10}
                maxFiles={5}
                onFilesChange={handleFilesChange}
                label="Upload Partner Documents"
                description="Upload contracts, certificates, or other relevant documents"
                showPreview={true}
            />
            {/* <Select
                control={control}
                label="Select"
                name="skills"
                options={skillOptions}
            /> */}
            <MultiSelect control={control} label="Select" name="skills" options={skillOptions}/>
        </>
    );
}
