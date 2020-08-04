import React from 'react';
import { useFrame, } from '../../utilities/frame';
export const ContextualSaveBar = React.memo(function ContextualSaveBar({ message, saveAction, discardAction, alignContentFlush, fullWidth, }) {
    const { setContextualSaveBar, removeContextualSaveBar } = useFrame();
    React.useEffect(() => {
        setContextualSaveBar({
            message,
            saveAction,
            discardAction,
            alignContentFlush,
            fullWidth,
        });
    }, [
        message,
        saveAction,
        discardAction,
        alignContentFlush,
        setContextualSaveBar,
        fullWidth,
    ]);
    React.useEffect(() => {
        return removeContextualSaveBar;
    }, [removeContextualSaveBar]);
    return null;
});
