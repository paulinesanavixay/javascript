class ThemeSwitcher {
    constructor() {
        
        this.body = document.body;
        this.lightThemeBtn = document.getElementById("lightThemeBtn");
        this.darkThemeBtn = document.getElementById("darkThemeBtn");

        // Récup thème actuel depuis le localStorage, s'il existe
        const savedTheme = localStorage.getItem("theme");

        // thmepar défaut (clair)
        if (savedTheme) {
            this.applyTheme(savedTheme);
        } else {
            this.applyTheme("light");
        }

        
        this.lightThemeBtn.addEventListener("click", () => this.switchToLightTheme());
        this.darkThemeBtn.addEventListener("click", () => this.switchToDarkTheme());
    }

    // methode applique le thème
    applyTheme(theme) {
       
        if (theme === "light") {
            this.body.classList.remove("dark");
        } 
       
        else if (theme === "dark") {
            this.body.classList.add("dark");
        }
        
        // Sauvegarde dans localStorage
        localStorage.setItem("theme", theme);
    }

    //  thème clair
    switchToLightTheme() {
        this.applyTheme("light");
    }

    // passe thème sombre
    switchToDarkTheme() {
        this.applyTheme("dark");
    }
}


document.addEventListener("DOMContentLoaded", () => {
    new ThemeSwitcher();
});
