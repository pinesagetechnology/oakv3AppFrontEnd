export const CAMERA_DEFAULTS = {
    auto_exposure: true,
    auto_focus: true,
    auto_white_balance: true,
    auto_exposure_lock: false,
    auto_white_balance_lock: false,
    exposure_time: 20000,
    iso_sensitivity: 800,
    focus_position: 130,
    white_balance_mode: 'AUTO',
    white_balance_temperature: 4000,
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 1,
    luma_denoise: 1,
    chroma_denoise: 1,
    anti_banding_mode: 'MODE_50HZ',
    effect_mode: 'OFF',
    auto_exposure_compensation: 0,
    fps: 30,
    resolution_width: 1920,
    resolution_height: 1440
};

export const EXPOSURE_RANGE = { min: 1000, max: 500000, step: 500 };
export const ISO_RANGE = { min: 100, max: 1600, step: 50 };
export const FOCUS_RANGE = { min: 0, max: 255, step: 1 };
export const BRIGHTNESS_RANGE = { min: -10, max: 10, step: 1 };
export const CONTRAST_RANGE = { min: -10, max: 10, step: 1 };
export const SATURATION_RANGE = { min: -10, max: 10, step: 1 };
export const SHARPNESS_RANGE = { min: 0, max: 4, step: 1 };
export const WHITE_BALANCE_RANGE = { min: 1000, max: 12000, step: 100 };
export const FPS_RANGE = { min: 5, max: 60, step: 5 };

export const WHITE_BALANCE_MODES = [
    'OFF', 'AUTO', 'INCANDESCENT', 'FLUORESCENT',
    'WARM_FLUORESCENT', 'DAYLIGHT', 'CLOUDY_DAYLIGHT',
    'TWILIGHT', 'SHADE'
];

export const ANTI_BANDING_MODES = [
    'OFF', 'MODE_50HZ', 'MODE_60HZ', 'MODE_AUTO'
];

export const EFFECT_MODES = [
    'OFF', 'MONO', 'NEGATIVE', 'SOLARIZE', 'SEPIA',
    'POSTERIZE', 'WHITEBOARD', 'BLACKBOARD', 'AQUA'
];

export const VIDEO_CODECS = [
    { value: 'h264', label: 'H.264' },
    { value: 'h265', label: 'H.265' },
    { value: 'mjpeg', label: 'MJPEG' }
];
