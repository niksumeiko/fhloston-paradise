interface TextInputProps {
    id: string;
    type?: string;
    name: string
}

export function TextInput({
    id,
    type = 'text',
    name
}: TextInputProps) {
    return (
        <input
            id={id}
            type={type}
            name={name}
            className="w-full rounded border px-3 py-2"
        />
    );
}
