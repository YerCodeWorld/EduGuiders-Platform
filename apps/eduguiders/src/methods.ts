

export const getInitials = (text: string | undefined): string | undefined => {

    if (text === undefined) return '';

    return text
        .split(' ')
        .map(word => word[0])
        .join('');

}