import React from 'react';
import { Eye, EyeOff, Focus, Sun, Palette, Contrast, RotateCcw, Settings } from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';
import { useConnectionStore } from '../../store/connectionStore';
import { useUIStore } from '../../store/uiStore';
import {
    EXPOSURE_RANGE,
    ISO_RANGE,
    FOCUS_RANGE,
    BRIGHTNESS_RANGE,
    CONTRAST_RANGE,
    SATURATION_RANGE,
    WHITE_BALANCE_RANGE,
    FPS_RANGE
} from '../../utils/constants';
import Slider from '../UI/Slider';
import Toggle from '../UI/Toggle';
import Button from '../UI/Button';
import Card from '../UI/Card';
import Stack from '../Layout/Stack';

const CameraSettings = () => {
    const {
        settings,
        isUpdatingSettings,
        updateSetting,
        resetSettings,
        triggerAutofocus,
        setManualFocus
    } = useCamera();
    const { isConnected } = useConnectionStore();
    const { showAdvancedControls, toggleAdvancedControls } = useUIStore();

    const handleSettingChange = (key, value) => {
        updateSetting(key, value);
    };

    const handleFocusChange = (value) => {
        setManualFocus(value);
    };

    if (!isConnected) {
        return (
            <div className="text-center py-8">
                <Settings className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">
                    Camera Not Connected
                </h3>
                <p className="text-sm text-gray-500">
                    Connect to your camera to access controls
                </p>
            </div>
        );
    }

    return (
        <Stack spacing={6}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Camera Controls</h2>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleAdvancedControls}
                    >
                        {showAdvancedControls ? 'Basic' : 'Advanced'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        icon={RotateCcw}
                        onClick={resetSettings}
                        disabled={isUpdatingSettings}
                    >
                        Reset
                    </Button>
                </div>
            </div>

            {/* Auto Controls */}
            <Card title="Auto Controls" icon={Eye}>
                <Stack spacing={4}>
                    <Toggle
                        checked={settings.auto_exposure}
                        onChange={(checked) => handleSettingChange('auto_exposure', checked)}
                        label="Auto Exposure"
                        description="Automatically adjust exposure and ISO"
                        disabled={isUpdatingSettings}
                    />

                    <Toggle
                        checked={settings.auto_focus}
                        onChange={(checked) => handleSettingChange('auto_focus', checked)}
                        label="Auto Focus"
                        description="Continuous autofocus"
                        disabled={isUpdatingSettings}
                    />

                    <Toggle
                        checked={settings.auto_white_balance}
                        onChange={(checked) => handleSettingChange('auto_white_balance', checked)}
                        label="Auto White Balance"
                        description="Automatically adjust color temperature"
                        disabled={isUpdatingSettings}
                    />

                    {/* Focus Trigger */}
                    <div className="flex items-center space-x-2">
                        <Button
                            onClick={triggerAutofocus}
                            variant="outline"
                            size="sm"
                            icon={Focus}
                            disabled={isUpdatingSettings}
                        >
                            Trigger AF
                        </Button>
                        <span className="text-xs text-gray-500">Press F or click to focus</span>
                    </div>
                </Stack>
            </Card>

            {/* Manual Controls */}
            <Card title="Manual Controls" icon={Settings}>
                <Stack spacing={4}>
                    {/* Exposure */}
                    <Slider
                        label="Exposure Time"
                        value={settings.exposure_time}
                        onChange={(value) => handleSettingChange('exposure_time', value)}
                        min={EXPOSURE_RANGE.min}
                        max={EXPOSURE_RANGE.max}
                        step={EXPOSURE_RANGE.step}
                        unit="μs"
                        disabled={settings.auto_exposure || isUpdatingSettings}
                    />

                    {/* ISO */}
                    <Slider
                        label="ISO Sensitivity"
                        value={settings.iso_sensitivity}
                        onChange={(value) => handleSettingChange('iso_sensitivity', value)}
                        min={ISO_RANGE.min}
                        max={ISO_RANGE.max}
                        step={ISO_RANGE.step}
                        disabled={settings.auto_exposure || isUpdatingSettings}
                    />

                    {/* Focus */}
                    <Slider
                        label="Focus Position"
                        value={settings.focus_position}
                        onChange={handleFocusChange}
                        min={FOCUS_RANGE.min}
                        max={FOCUS_RANGE.max}
                        step={FOCUS_RANGE.step}
                        disabled={settings.auto_focus || isUpdatingSettings}
                    />

                    {/* White Balance */}
                    <Slider
                        label="White Balance"
                        value={settings.white_balance_temperature}
                        onChange={(value) => handleSettingChange('white_balance_temperature', value)}
                        min={WHITE_BALANCE_RANGE.min}
                        max={WHITE_BALANCE_RANGE.max}
                        step={WHITE_BALANCE_RANGE.step}
                        unit="K"
                        disabled={settings.auto_white_balance || isUpdatingSettings}
                    />
                </Stack>
            </Card>

            {/* Advanced Controls */}
            {showAdvancedControls && (
                <Card title="Image Enhancement" icon={Palette}>
                    <Stack spacing={4}>
                        <Slider
                            label="Brightness"
                            value={settings.brightness}
                            onChange={(value) => handleSettingChange('brightness', value)}
                            min={BRIGHTNESS_RANGE.min}
                            max={BRIGHTNESS_RANGE.max}
                            step={BRIGHTNESS_RANGE.step}
                            disabled={isUpdatingSettings}
                        />

                        <Slider
                            label="Contrast"
                            value={settings.contrast}
                            onChange={(value) => handleSettingChange('contrast', value)}
                            min={CONTRAST_RANGE.min}
                            max={CONTRAST_RANGE.max}
                            step={CONTRAST_RANGE.step}
                            disabled={isUpdatingSettings}
                        />

                        <Slider
                            label="Saturation"
                            value={settings.saturation}
                            onChange={(value) => handleSettingChange('saturation', value)}
                            min={SATURATION_RANGE.min}
                            max={SATURATION_RANGE.max}
                            step={SATURATION_RANGE.step}
                            disabled={isUpdatingSettings}
                        />

                        <Slider
                            label="Sharpness"
                            value={settings.sharpness}
                            onChange={(value) => handleSettingChange('sharpness', value)}
                            min={0}
                            max={4}
                            step={1}
                            disabled={isUpdatingSettings}
                        />
                    </Stack>
                </Card>
            )}

            {/* Stream Settings */}
            <Card title="Stream Settings" icon={Video}>
                <Stack spacing={4}>
                    <Slider
                        label="Frame Rate"
                        value={settings.fps}
                        onChange={(value) => handleSettingChange('fps', value)}
                        min={FPS_RANGE.min}
                        max={FPS_RANGE.max}
                        step={FPS_RANGE.step}
                        unit="FPS"
                        disabled={isUpdatingSettings}
                    />

                    <div className="text-sm text-gray-400">
                        Resolution: {settings.resolution_width} × {settings.resolution_height}
                    </div>
                </Stack>
            </Card>

            {/* Status */}
            {isUpdatingSettings && (
                <div className="text-center py-2">
                    <div className="text-sm text-oak-400">Updating settings...</div>
                </div>
            )}
        </Stack>
    );
};

export default CameraSettings;