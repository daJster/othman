import { useTranslation } from 'react-i18next';
import { DeferredButton } from '@/components/ui/deferred-button';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/firebase';

export const GoogleAuthToggle = () => {
    const { t } = useTranslation();

    const handleGoogleLogin = async () => {
        await signInWithPopup(auth, googleProvider);
    };

    return (
        <DeferredButton
            variant="outline"
            asyncFn={handleGoogleLogin}
            onResolve={() => {
                window.location.href = '/';
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl h-11"
        >
            <img src="/google.svg" alt="" className={'h-6 w-6'} />
            <p>{t('action.auth.google')}</p>
        </DeferredButton>
    );
};
