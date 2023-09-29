import styles from "./PrimaryButton.module.scss";

interface PrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}
const PrimaryButton = ({ children, className, ...props }: PrimaryProps) => {
  return (
    <button className={[styles.primaryButton, className].join(" ")} {...props}>
      {children}
    </button>
  );
};

export default PrimaryButton;
