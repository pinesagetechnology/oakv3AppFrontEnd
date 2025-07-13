export const validateCameraSettings = (settings) => {
    const errors = {};

    if (settings.exposure_time < EXPOSURE_RANGE.min || settings.exposure_time > EXPOSURE_RANGE.max) {
        errors.exposure_time = `Exposure time must be between ${EXPOSURE_RANGE.min} and ${EXPOSURE_RANGE.max}`;
    }

    if (settings.iso_sensitivity < ISO_RANGE.min || settings.iso_sensitivity > ISO_RANGE.max) {
        errors.iso_sensitivity = `ISO must be between ${ISO_RANGE.min} and ${ISO_RANGE.max}`;
    }

    if (settings.focus_position < FOCUS_RANGE.min || settings.focus_position > FOCUS_RANGE.max) {
        errors.focus_position = `Focus position must be between ${FOCUS_RANGE.min} and ${FOCUS_RANGE.max}`;
    }

    if (settings.fps < FPS_RANGE.min || settings.fps > FPS_RANGE.max) {
        errors.fps = `FPS must be between ${FPS_RANGE.min} and ${FPS_RANGE.max}`;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};