import { ConfirmProps } from 'components/OverlaysProvider/OverlayConfirm';
import { OverlayContext } from '../components/OverlaysProvider';
import { useContext } from 'react';

interface UseOverlayReturnProps {
    showConfirm: (props: Omit<ConfirmProps, 'open'>) => void;
}

export default function useOverlay(): UseOverlayReturnProps {
    const overlay = useContext(OverlayContext);

    return {
        showConfirm: (props: Omit<ConfirmProps, 'open'>) => {
            overlay.setConfirmProps({ open: true, ...props });
        },
    };
}
