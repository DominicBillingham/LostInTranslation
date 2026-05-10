export class HintManager {
    private static hints: Record<string, string> = {};
    private static isLoaded = false;

    static async loadHints(): Promise<void> {
        if (this.isLoaded) return;

        try {
            
            const allFiles = ['ENhints.json', 'CAhints.json', 'FRA2hints.json', 'FRB1hints.json'];
            
            const results = await Promise.allSettled(
                allFiles.map(file => fetch(`./locales/${file}`).then(res => {
                    if (!res.ok) throw new Error(`Failed to load ${file}`);
                    return res.json();
                }))
            );

            results.forEach(result => {
                if (result.status === 'fulfilled') {
                    this.hints = { ...this.hints, ...result.value };
                }
            });
            this.isLoaded = true;
        } catch (error) {
            console.error("Failed to load hints:", error);
        }
    }

    static getHints(): Record<string, string> {
        return this.hints;
    }
}
