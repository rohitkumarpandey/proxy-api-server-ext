
interface ButtonProps {
    label: string;
    type?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    isDisabled?: boolean;
    handler: () => void;
}
const Button: React.FC<ButtonProps> = ({ label, type = 'primary', size = 'sm', isDisabled = false, handler }) => {
    return (
        <>
            <button className={`btn-${type} btn-${size}`} disabled={isDisabled} onClick={handler}>
                {label}
            </button></>
    )
}

export default Button;