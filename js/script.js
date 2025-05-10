
// Configuration
const config = {
    serverInfo: {
        serverLogoImageFileName: "logo.png",
        serverName: "Zephyrus SMP",
        serverIp: "147.185.221.25:56947",
        serverBedrockIp: "147.185.221.25:19132",
        discordServerID: "1079412112767598703"
    },
    contactPage: {
        email: "zephyrussmp@gmail.com"
    }
};

// Mobile navbar toggle
document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");
    const navbarLinks = document.querySelector(".links");
    const hamburger = document.querySelector(".hamburger");

    if (hamburger && navbar && navbarLinks) {
        hamburger.addEventListener("click", () => {
            navbar.classList.toggle("active");
            navbarLinks.classList.toggle("active");
        });
    }
});

const getDiscordOnlineUsers = async () => {
    try {
        const apiWidgetUrl = `https://discord.com/api/guilds/${config.serverInfo.discordServerID}/widget.json`;
        const response = await fetch(apiWidgetUrl);
        const data = await response.json();
        return data.presence_count || 0;
    } catch (e) {
        console.error("Discord fetch error:", e);
        return 0;
    }
};

const getJavaOnlinePlayers = async () => {
    try {
        const apiUrl = `https://api.mcstatus.io/v2/status/java/${config.serverInfo.serverIp}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.players?.online || 0;
    } catch (e) {
        console.error("Java status error:", e);
        return 0;
    }
};

const getBedrockOnlinePlayers = async () => {
    try {
        const apiUrl = `https://api.mcstatus.io/v2/status/bedrock/${config.serverInfo.serverBedrockIp}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.players?.online || 0;
    } catch (e) {
        console.error("Bedrock status error:", e);
        return 0;
    }
};

const copyIp = () => {
    const btn = document.querySelector(".copy-ip");
    const alert = document.querySelector(".ip-copied");
    if (!btn || !alert) return;
    btn.addEventListener("click", () => {
        navigator.clipboard.writeText(config.serverInfo.serverIp)
            .then(() => {
                alert.classList.add("active");
                setTimeout(() => alert.classList.remove("active"), 5000);
            })
            .catch(e => {
                console.error("Copy error:", e);
                alert.textContent = "Error copying IP";
                alert.classList.add("active", "error");
                setTimeout(() => alert.classList.remove("active", "error"), 5000);
            });
    });
};

const setDataFromConfigToHtml = async () => {
    const logoImg = document.querySelector(".logo-img");
    const logoImgHeader = document.querySelector(".logo-img-header");
    const serverNameElem = document.querySelector(".server-name");
    const serverIpElem = document.querySelector(".minecraft-server-ip");

    if (serverNameElem) serverNameElem.textContent = config.serverInfo.serverName;
    if (logoImg) logoImg.src = `images/${config.serverInfo.serverLogoImageFileName}`;
    if (serverIpElem) serverIpElem.textContent = config.serverInfo.serverIp;
    if (logoImgHeader) logoImgHeader.src = `images/${config.serverInfo.serverLogoImageFileName}`;

    copyIp();

    const discordElem = document.querySelector(".discord-online-users");
    if (discordElem) discordElem.textContent = await getDiscordOnlineUsers();

    const playerElem = document.querySelector(".minecraft-online-players");
    if (playerElem) {
        const javaCount = await getJavaOnlinePlayers();
        const bedrockCount = await getBedrockOnlinePlayers();
        const total = javaCount + bedrockCount;
        playerElem.textContent = `${total}`;
    }

    if (window.location.pathname.includes("contact")) {
        const contactForm = document.querySelector(".contact-form");
        const inputWithLocationAfterSubmit = document.querySelector(".location-after-submit");
        if (contactForm) contactForm.action = `https://formsubmit.co/${config.contactPage.email}`;
        if (inputWithLocationAfterSubmit) inputWithLocationAfterSubmit.value = location.href;
        if (discordElem) discordElem.textContent = await getDiscordOnlineUsers();
    }
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    setDataFromConfigToHtml();
});
