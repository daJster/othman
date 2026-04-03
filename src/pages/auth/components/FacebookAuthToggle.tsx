import { useTranslation } from 'react-i18next';
import { DeferredButton } from '@/components/ui/deferred-button';
import { signInWithPopup } from 'firebase/auth';
import { auth, facebookProvider } from '@/firebase';

export const FacebookAuthToggle = () => {
    const { t } = useTranslation();

    const handleFacebookLogin = async () => {
        await signInWithPopup(auth, facebookProvider);
    };

    return (
        <DeferredButton
            variant="outline"
            asyncFn={handleFacebookLogin}
            onResolve={() => {
                window.location.href = '/';
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl h-11"
        >
            <img src="/facebook.svg" alt="" className={'h-6 w-6'} />
            <p>{t('action.auth.facebook')}</p>
        </DeferredButton>
    );
};
