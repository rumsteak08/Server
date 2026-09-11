const TEMPLATE_URL = 'data/profile-options.json';

let profileTemplate;

function getOption(group, value) {
    return group.options.find((option) => option.value === value);
}

function requirementIsMet(requirement, selections) {
    return selections[requirement.key] === requirement.equals;
}

function optionIsAvailable(option, currentRam, selections) {
    const meetsRam = !option.minRam || currentRam >= option.minRam;
    const meetsDependencies = !option.requires
        || option.requires.every((requirement) => requirementIsMet(requirement, selections));
    return meetsRam && meetsDependencies;
}

function getSelections() {
    return Object.fromEntries(profileTemplate.options.map((group) => [
        group.key,
        document.getElementById(group.controlId).value
    ]));
}

function populateTemplate() {
    const { ram, options } = profileTemplate;
    const ramSlider = document.getElementById(ram.controlId);
    const ramIndex = ram.values.findIndex((item) => item.value === ram.default);

    ramSlider.min = '0';
    ramSlider.max = String(ram.values.length - 1);
    ramSlider.value = String(Math.max(ramIndex, 0));
    document.querySelector('[data-config-label="ram"]').textContent = ram.label;
    document.querySelector('[data-config-description="ram"]').textContent = ram.description;

    options.forEach((group) => {
        const select = document.getElementById(group.controlId);
        const label = document.querySelector(`[data-config-label="${group.key}"]`);
        const description = document.querySelector(`[data-config-description="${group.key}"]`);

        label.textContent = group.label;
        description.textContent = group.description;
        select.replaceChildren(...group.options.map((option) => new Option(option.label, option.value)));
        select.value = group.default;
    });
}

function updateBuilder() {
    const { ram, options, download, warnings } = profileTemplate;
    const ramSlider = document.getElementById(ram.controlId);
    const currentRamOption = ram.values[Number(ramSlider.value)];
    const currentRam = currentRamOption.value;
    const ramDisplay = document.getElementById(ram.displayId);
    const selections = getSelections();

    ramDisplay.textContent = currentRamOption.label;

    options.forEach((group) => {
        const select = document.getElementById(group.controlId);
        const selectedOption = getOption(group, select.value);
        const availableOptions = group.options.filter((option) => optionIsAvailable(option, currentRam, selections));

        group.options.forEach((option) => {
            const optionElement = select.querySelector(`option[value="${option.value}"]`);
            optionElement.disabled = !availableOptions.includes(option);
        });

        if (!selectedOption || !optionIsAvailable(selectedOption, currentRam, selections)) {
            const fallback = availableOptions.find((option) => option.value === group.default) || availableOptions[0];
            select.value = fallback.value;
            selections[group.key] = fallback.value;
        }
    });

    const finalSelections = getSelections();
    warnings.forEach((warning) => {
        const target = document.getElementById(warning.targetId);
        const currentValue = finalSelections[warning.when.key];
        target.hidden = warning.when.equalsAny
            ? !warning.when.equalsAny.includes(currentValue)
            : currentValue !== warning.when.equals;
    });

    const urlParts = {
        ram: currentRamOption.urlElement,
        ...Object.fromEntries(options.map((group) => [
            group.key,
            getOption(group, finalSelections[group.key]).urlElement
        ]))
    };

    const filename = download.filenameTemplate.replace(/\{(\w+)\}/g, (_, key) => urlParts[key] || '');
    document.getElementById('dynamic-link').textContent = `${download.baseUrl}${filename}`;
}

async function loadTemplate() {
    const response = await fetch(TEMPLATE_URL);
    if (!response.ok) throw new Error(`Could not load ${TEMPLATE_URL}`);
    profileTemplate = await response.json();
}

export async function bindProfileBuilder() {
    try {
        await loadTemplate();
        populateTemplate();
    } catch (error) {
        document.getElementById('dynamic-link').textContent = 'Profile template unavailable.';
        console.error(error);
        return;
    }

    const fields = document.querySelectorAll('#builder select, #builder input');
    fields.forEach((field) => {
        field.addEventListener('input', updateBuilder);
        field.addEventListener('change', updateBuilder);
    });

    const copyButton = document.getElementById('copy-link');
    copyButton?.addEventListener('click', async () => {
        const link = document.getElementById('dynamic-link').textContent;
        await navigator.clipboard.writeText(link);
        copyButton.textContent = 'Copied';
        window.setTimeout(() => { copyButton.textContent = 'Copy'; }, 1400);
    });

    updateBuilder();
}
