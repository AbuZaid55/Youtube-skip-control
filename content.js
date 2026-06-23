async function getSettings() {
    try {
        return await chrome.storage.sync.get({
            enabled: true,
            forwardValue: 1,
            forwardUnit: "minutes",
            backwardValue: 30,
            backwardUnit: "seconds"
        });
    } catch (error) {
        console.error(error);

        return {
            enabled: true,
            forwardValue: 1,
            forwardUnit: "minutes",
            backwardValue: 30,
            backwardUnit: "seconds"
        };
    }
}

function toSeconds(value, unit) {
    value = Number(value) || 0;

    return unit === "minutes"
        ? value * 60
        : value;
}

function showToast(message) {
    const existing = document.getElementById(
        "yt-skip-control-toast"
    );

    if (existing) {
        existing.remove();
    }

    const toast = document.createElement("div");

    toast.id = "yt-skip-control-toast";
    toast.textContent = message;

    Object.assign(toast.style, {
        position: "fixed",
        top: "80px",
        right: "20px",
        zIndex: "999999",
        background: "rgba(0,0,0,0.85)",
        color: "#fff",
        padding: "10px 16px",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: "600",
        pointerEvents: "none",
        boxShadow: "0 4px 10px rgba(0,0,0,.3)"
    });

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 1200);
}

window.addEventListener(
    "keydown",
    async (event) => {

        const settings = await getSettings();

        if (!settings.enabled) {
            return;
        }

        const video =
            document.querySelector("video");

        if (!video) {
            return;
        }

        // CTRL + SHIFT + RIGHT
        if (
            event.ctrlKey &&
            event.shiftKey &&
            event.key === "ArrowRight"
        ) {

            const seconds = toSeconds(
                settings.forwardValue,
                settings.forwardUnit
            );

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            video.currentTime += seconds;

            showToast(`+${seconds}s`);

        }

        // CTRL + SHIFT + LEFT
        if (
            event.ctrlKey &&
            event.shiftKey &&
            event.key === "ArrowLeft"
        ) {

            const seconds = toSeconds(
                settings.backwardValue,
                settings.backwardUnit
            );

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            video.currentTime -= seconds;

            showToast(`-${seconds}s`);
        }
    },
    true
);