type Props = {
    className?: string;
};

export default function AppLogoIcon({ className }: Props) {
    return (
        <img
            src="/whatthehellhaveidone.png"
            alt="What the HELL have i DONE"
            className={className}
            style={{ objectFit: 'contain' }}
        />
    );
}
