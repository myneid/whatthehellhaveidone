export function formatCardNumber(number: number): string {
    return `#${number}`;
}

export function formatCardReference(card: {
    number: number;
    title: string;
}): string {
    return `${formatCardNumber(card.number)} ${card.title}`;
}
