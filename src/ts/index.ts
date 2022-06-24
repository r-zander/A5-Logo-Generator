import * as bootstrap from 'bootstrap';

// @ts-ignore
import {saveSvgAsPng, saveSvg} from 'save-svg-as-png';

const variants = [
    (size: number) => {
        if (size <= 96) {
            return '.a5-logo-level1.a5-logo-small';
        }
        return '.a5-logo-level1.a5-logo-large';
    },
    (size: number) => {
        if (size <= 184) {
            return '.a5-logo-level2.a5-logo-small';
        }
        return '.a5-logo-level2.a5-logo-large';
    },
    () => '.a5-logo-level3',
    () => '.a5-logo-level4',
    () => '.a5-logo-level5',
];

const variantPaddings: {[key: string]: number} = {
    '.a5-logo-level1.a5-logo-small': 0.052,
    '.a5-logo-level1.a5-logo-large': 0.052,
    '.a5-logo-level2.a5-logo-small': 0.052,
    '.a5-logo-level2.a5-logo-large': 0.052,
    '.a5-logo-level3': 0.012,
    '.a5-logo-level4': 0.008,
    '.a5-logo-level5': 0.0,
}

// TODO refactor into foreground selection and background selection
const colorSchemes = [
    'a5-black-white',
    'a5-white-black',
    'a5-white-transparent',
    'a5-black-transparent',
    'a5-red-black',
    'a5-black-parchment',
    'a5-royal-blue-white',
    'a5-royal-blue-black',
    'a5-royal-blue-transparent',
    'a5-royal-blue-parchment',
    'a5-forest-green-white',
    'a5-forest-green-black',
    'a5-forest-green-transparent',
    'a5-forest-green-parchment'
];

const definedSizes = [
    /**
     * STEAM
     * see https://steamcommunity.com/profiles/76561198000093332/edit/avatar
     */
    {size: 184, name: 'Steam-Avatar'},

    /**
     * DISCORD
     * see https://twitter.com/discord/status/824254681681686530
     * Kind of unclear, 256 seems to be better than 128
     */
    {size: 256, name: 'Discord-Avatar'},

    /**
     * DISCOURSE
     * see http://forum.rza.io/admin/site_settings/category/all_results?filter=avatar%20sizes
     */
    {size: 120, name: 'Forum-Avatar'},

    /**
     * WHATSAPP
     * no official documentation
     */
    {size: 640, name: 'Whatsapp-Profil'},

    /**
     * TWITCH
     * official: minimum 200x200, API supports 600x600
     */
    {size: 600, name: 'Twitch-Profil'},
];

// Pre-Selection
const preSelect = {
    variantIndex: 1,
    colorSchemeIndex: 3,
    definedSizeIndex: -1
}

const selection = {
    variant: variants[preSelect.variantIndex],
    colorScheme: colorSchemes[preSelect.colorSchemeIndex],
    size: 128,
    sizeName: null,
    padding: 0,
}

const elements = {
    sizeInput: <HTMLInputElement>document.getElementById('sizeInput'),
    paddingInput: <HTMLInputElement>document.getElementById('paddingInput'),
    preDefinedPaddingToggle: <HTMLInputElement>document.getElementById('preDefinedPaddingToggle'),
    autoNextSettingToggle: <HTMLInputElement>document.getElementById('autoNextSettingToggle'),
    advancedSettingsToggle: <HTMLInputElement>document.getElementById('advancedSettingsToggle')
}

const minSize = parseInt(elements.sizeInput.min);
let autoNextSetting = elements.autoNextSettingToggle.checked;

function adjustPaddingToVariant() {
    selection.padding = variantPaddings[selection.variant(selection.size)];
    elements.paddingInput.valueAsNumber = selection.padding * 100;
}

function resetPreviewPaddings() {
    for (const [variant, padding] of Object.entries(variantPaddings)) {
        (<HTMLElement>document.querySelector('#preview > ' + variant)).style.padding = paddingPercentageToString(padding);
    }
    adjustPaddingToVariant();
}

resetPreviewPaddings();

function paddingPercentageToString(number: number): string {
    return (100 * number) + '%';
}

document.querySelectorAll('input[name="variantRadio"]').forEach((element) => {
    if (parseInt((<HTMLInputElement>element).value) === preSelect.variantIndex) {
        (<HTMLInputElement>element).checked = true;
    }
    element.addEventListener('change', onVariantSelect);
});

function onVariantSelect(event: Event) {
    let element: HTMLInputElement = <HTMLInputElement>event.target;
    if (element.checked) {
        setVariant(variants[parseInt(element.value)]);
        if (autoNextSetting) {
            showSection('collapseColorScheme');
        }
    }
}

function showSection(sectionId: string) {
    let collapseElement = <HTMLElement>document.getElementById(sectionId);
    let collapse = bootstrap.Collapse.getInstance(collapseElement);
    if (collapse === null) {
        collapse = new bootstrap.Collapse(collapseElement, {
            parent: <Element>document.getElementById('settingsAccordion')
        });
    }
    collapse.show();
}

function isSectionShown(sectionId: string):boolean {
    let collapseElement = <HTMLElement>document.getElementById(sectionId);
    return collapseElement !== null && collapseElement.classList.contains('show');
}

function setVariant(variant: (size: number) => (string)) {
    if (selection.variant === variant) {
        return;
    }

    adjustVariantOnSizeChanged(variant);
    let variantSelector = variant(minSize); // always use the "small" variant
    document.querySelectorAll('#collapseColorScheme .a5-logo').forEach((element) => {
        if (element.matches(variantSelector)) {
            element.classList.remove('d-none');
        } else {
            element.classList.add('d-none');
        }
    });

    // @ts-ignore
    selection.variant = variant;

    if (elements.preDefinedPaddingToggle.checked) {
        adjustPaddingToVariant();
    }
}

function adjustVariantOnSizeChanged(variant: (size: number) => (string)) {
    let variantSelector = variant(selection.size);
    document.querySelectorAll('#preview > .a5-logo').forEach((element) => {
        if (element.matches(variantSelector)) {
            element.classList.remove('d-none');
        } else {
            element.classList.add('d-none');
        }
    });
}

document.querySelectorAll('input[name="colorRadio"]').forEach((element) => {
    if (parseInt((<HTMLInputElement>element).value) === preSelect.colorSchemeIndex) {
        (<HTMLInputElement>element).checked = true;
    }
    element.addEventListener('change', onColorSchemeSelect);
});

function onColorSchemeSelect(event: Event) {
    let element: HTMLInputElement = <HTMLInputElement>event.target;
    if (element.checked) {
        setColorScheme(colorSchemes[parseInt(element.value)]);
        if (autoNextSetting) {
            showSection('collapseSize');
        }
    }
}

function setColorScheme(colorScheme: string) {
    let previewElement: HTMLElement = <HTMLElement>document.getElementById('preview');

    colorSchemes.forEach((definedColorScheme) => {
        if (colorScheme === definedColorScheme) {
            previewElement.classList.add(definedColorScheme);
        } else {
            previewElement.classList.remove(definedColorScheme);
        }
    });

    selection.colorScheme = colorScheme;
}

document.querySelectorAll('input[name="sizeRadio"]').forEach((element) => {
    if (parseInt((<HTMLInputElement>element).value) === preSelect.definedSizeIndex) {
        (<HTMLInputElement>element).checked = true;
    }
    element.addEventListener('change', onSizeSelected);
});

function onSizeSelected(event: Event) {
    let element: HTMLInputElement = <HTMLInputElement>event.target;
    if (element.checked) {
        let definedSize = definedSizes[parseInt(element.value)];
        setSize(definedSize.size);
        // @ts-ignore
        selection.sizeName = definedSize.name;
    }
}

function setSize(size: number, triggeredByInput: boolean = false) {
    if (size < minSize) {
        size = minSize;
    }

    let previewElement: HTMLElement = <HTMLElement>document.getElementById('preview');
    previewElement.style.width = (size + 2) + 'px'; // +2 for border
    selection.size = size;
    if (!triggeredByInput) {
        elements.sizeInput.valueAsNumber = size;
    }

    adjustVariantOnSizeChanged(selection.variant);
}

function setPadding(padding: number, triggeredByInput: boolean) {
    if (padding < 0) {
        padding = 0;
    }

    document.querySelectorAll('#preview > .a5-logo').forEach((previewElement) => {
        (<HTMLElement>previewElement).style.padding = paddingPercentageToString(padding);
    });

    selection.padding = padding;
    if (!triggeredByInput) {
        elements.paddingInput.valueAsNumber = padding * 100;
    }
}

(<HTMLElement>document.getElementById('pngDownload')).addEventListener('click', () => {
    saveImage('asPNG');
});

(<HTMLElement>document.getElementById('svgDownload')).addEventListener('click', () => {
    saveImage('asSVG');
});

function saveImage(downloadType: string) {
    let variant = selection.variant(selection.size);
    let svgElement = <SVGSVGElement>document.querySelector('#preview > ' + variant);
    let exportElement = <SVGSVGElement>svgElement.cloneNode(true);
    let parent = <HTMLElement>svgElement.parentElement;
    exportElement.style.backgroundColor = window.getComputedStyle(parent).backgroundColor;
    exportElement.style.fill = window.getComputedStyle(svgElement).fill;
    let padding: number;
    if (elements.preDefinedPaddingToggle.checked) {
        padding = variantPaddings[variant];
    } else {
        padding = selection.padding;
    }
    exportElement.style.padding = paddingPercentageToString(padding);

    let {width, height} = svgElement.viewBox.baseVal;
    let scaleDown = (1 - 2 * padding);

    switch (downloadType) {
        case 'asPNG':
            saveSvgAsPng(
                exportElement,
                generateExportName('png'),
                {
                    encoderOptions: 1,
                    scale: selection.size / width * scaleDown,
                    width: width / scaleDown,
                    height: height / scaleDown
                });
            break;
        case 'asSVG':
            saveSvg(
                exportElement,
                generateExportName('svg'),
                {
                    encoderOptions: 1,
                    scale: selection.size / width * scaleDown,
                    width: width / scaleDown,
                    height: height / scaleDown
                });
            break;
    }
}

function generateExportName(extension: string){
    let name = 'A5-Logo ';
    // TODO naming mostly for PNG, SVG could maybe use color scheme+level
    if (selection.sizeName === null) {
        name += selection.size + 'x' + selection.size + 'px';
    } else {
        name += selection.sizeName;
    }

    name += '.' + extension;

    return name;
}

elements.sizeInput.addEventListener('input', () => {
    setSize(elements.sizeInput.valueAsNumber, true);
    resetSizeSelection();
    // TODO könnte auch den korrekten Size button markieren, wenn die Size matcht
});

function resetSizeSelection() {
    document.querySelectorAll('input[name="sizeRadio"]').forEach((element) => {
        (<HTMLInputElement>element).checked = false;
    });
    selection.sizeName = null;
}

elements.paddingInput.addEventListener('input', () => {
    setPadding(elements.paddingInput.valueAsNumber / 100.0, true);
    let inputMatchesPreDefined = Math.abs(selection.padding - variantPaddings[selection.variant(selection.size)]) <= 0.0001;
    elements.preDefinedPaddingToggle.checked = inputMatchesPreDefined;
});

elements.preDefinedPaddingToggle.addEventListener('change', () => {
    if (elements.preDefinedPaddingToggle.checked) {
        resetPreviewPaddings();
    }
});

elements.autoNextSettingToggle.addEventListener('change', () => {
    autoNextSetting = elements.autoNextSettingToggle.checked;
});

elements.advancedSettingsToggle.addEventListener('change', () => {
    document.body.classList.toggle('advanced-settings', elements.advancedSettingsToggle.checked);
    document.body.classList.toggle('simple-settings', !elements.advancedSettingsToggle.checked);
});

window.addEventListener('load', () => {
    let previewElement = <HTMLElement>document.getElementById('preview');
    setSize(Math.min(previewElement.getBoundingClientRect().width - 2, 568));
});

window.addEventListener('keydown', (event) => {
    // Do not interfere with default browser behavior
    if (document.activeElement instanceof HTMLInputElement &&
        document.activeElement.type === 'number') {
        return;
    }

    if (isSectionShown('collapsePadding')){
        switch (event.code) {
            case 'ArrowUp':
                setPadding(selection.padding + parseFloat(elements.paddingInput.step) / 100.0, false);
                elements.preDefinedPaddingToggle.checked = false;
                elements.paddingInput.focus();
                break;
            case 'ArrowDown':
                setPadding(selection.padding - parseFloat(elements.paddingInput.step) / 100.0, false);
                elements.preDefinedPaddingToggle.checked = false;
                elements.paddingInput.focus();
                break;
        }

        return;
    }

    switch (event.code) {
        case 'ArrowUp':
            setSize(selection.size + parseInt(elements.sizeInput.step));
            showSection('collapseSize');
            elements.sizeInput.focus();
            break;
        case 'ArrowDown':
            setSize(selection.size - parseInt(elements.sizeInput.step));
            showSection('collapseSize');
            elements.sizeInput.focus();
            break;
    }
})
