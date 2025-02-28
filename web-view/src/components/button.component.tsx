
interface ButtonProps {
    label: string;
    type?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    handler: () => void;
}
const Button: React.FC<ButtonProps> = ({ label, type = 'primary', size = 'sm', handler }) => {
    return (
        <>
            <button className={`btn-${type} btn-${size}`} onClick={handler}>
                {label}
            </button></>
    )
}

export default Button;