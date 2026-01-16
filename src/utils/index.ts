// Format duration
export function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
}

export function truncateText(text: string, limit: number): string {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
}
