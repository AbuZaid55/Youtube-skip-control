const enabled = document.getElementById("enabled");

const forwardPreset = document.getElementById("forwardPreset");
const forwardCustom = document.getElementById("forwardCustom");
const forwardValue = document.getElementById("forwardValue");
const forwardUnit = document.getElementById("forwardUnit");

const backwardPreset = document.getElementById("backwardPreset");
const backwardCustom = document.getElementById("backwardCustom");
const backwardValue = document.getElementById("backwardValue");
const backwardUnit = document.getElementById("backwardUnit");

const saveBtn = document.getElementById("saveBtn");
const message = document.getElementById("message");

function updateCustomVisibility() {
    forwardCustom.classList.toggle(
        "show",
        forwardPreset.value === "custom"
    );

    backwardCustom.classList.toggle(
        "show",
        backwardPreset.value === "custom"
    );
}

forwardPreset.addEventListener(
    "change",
    updateCustomVisibility
);

backwardPreset.addEventListener(
    "change",
    updateCustomVisibility
);

enabled.addEventListener(
    "change",
    async () => {

        await chrome.storage.sync.set({
            enabled: enabled.checked
        });

        message.textContent =
            enabled.checked
                ? "Extension Enabled"
                : "Extension Disabled";

        setTimeout(() => {
            message.textContent = "";
        }, 1500);
    }
);

async function loadSettings() {

    const settings =
        await chrome.storage.sync.get({

            enabled: true,

            forwardValue: 60,
            forwardUnit: "seconds",

            backwardValue: 30,
            backwardUnit: "seconds"
        });

    enabled.checked =
        settings.enabled;

    const presetValues = [
        "5",
        "10",
        "30",
        "60",
        "120",
        "300"
    ];

    if (
        settings.forwardUnit === "seconds" &&
        presetValues.includes(
            String(settings.forwardValue)
        )
    ) {
        forwardPreset.value =
            String(settings.forwardValue);
    } else {
        forwardPreset.value =
            "custom";

        forwardValue.value =
            settings.forwardValue;

        forwardUnit.value =
            settings.forwardUnit;
    }

    if (
        settings.backwardUnit === "seconds" &&
        presetValues.includes(
            String(settings.backwardValue)
        )
    ) {
        backwardPreset.value =
            String(settings.backwardValue);
    } else {
        backwardPreset.value =
            "custom";

        backwardValue.value =
            settings.backwardValue;

        backwardUnit.value =
            settings.backwardUnit;
    }

    updateCustomVisibility();
}

saveBtn.addEventListener(
    "click",
    async () => {

        let finalForwardValue;
        let finalForwardUnit;

        if (
            forwardPreset.value === "custom"
        ) {

            finalForwardValue =
                Number(
                    forwardValue.value
                ) || 1;

            finalForwardUnit =
                forwardUnit.value;

        } else {

            finalForwardValue =
                Number(
                    forwardPreset.value
                );

            finalForwardUnit =
                "seconds";
        }

        let finalBackwardValue;
        let finalBackwardUnit;

        if (
            backwardPreset.value === "custom"
        ) {

            finalBackwardValue =
                Number(
                    backwardValue.value
                ) || 1;

            finalBackwardUnit =
                backwardUnit.value;

        } else {

            finalBackwardValue =
                Number(
                    backwardPreset.value
                );

            finalBackwardUnit =
                "seconds";
        }

        await chrome.storage.sync.set({

            enabled:
                enabled.checked,

            forwardValue:
                finalForwardValue,

            forwardUnit:
                finalForwardUnit,

            backwardValue:
                finalBackwardValue,

            backwardUnit:
                finalBackwardUnit
        });

        message.textContent =
            "✓ Settings Saved";

        setTimeout(() => {
            message.textContent = "";
        }, 1500);
    }
);

loadSettings();