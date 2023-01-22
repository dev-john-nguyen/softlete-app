import Loading from "./Loading";

interface Props {
    text: string;
    onClick?: () => void;
    loading?: boolean;
    type?: "button" | "submit" | "reset" | undefined;
}


const Button = ({ text, onClick, loading, type }: Props) => {
    return (
        <button className='button' type={type} onClick={onClick}>
            {text}
            {loading && <Loading />}
        </button>
    )
}

export default Button;