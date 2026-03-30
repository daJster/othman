
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";
import { useState } from "react";
import {createPhoneExtensionList} from "@/data/configData.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Field, FieldLabel} from "@/components/ui/field.tsx";


export const SignInPage = () => {
    const { t } = useTranslation();
    const [phone, setPhone] = useState("");
    const extensions =  createPhoneExtensionList()
    const [countryCode, setCountryCode] = useState(extensions[0].dialCode); // default France

    const handleLogin = () => {
        const fullPhone = `${countryCode}${phone}`;
        console.log("Login with:", fullPhone);
        // TODO: Firebase phone auth
    };

    const handleGoogleLogin = () => {
        console.log("Google login");
        // TODO: Firebase Google provider
    };

    const handleFacebookLogin = () => {
        console.log("Facebook login");
        // TODO: Firebase Facebook provider
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-green-900 px-4">
            <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-md shadow-sm p-8">

                {/* Header */}
                <div className="text-center mb-6 text-neutral-500 dark:text-neutral-200">
                    <h1 className="text-2xl font-semibold">
                        {t("auth.login.title")}
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        {t("auth.login.subtitle")}
                    </p>
                </div>

                {/* Phone input */}
                <div className="flex gap-2 mb-4 rtl:flex-row-reverse">
                    <div className="relative flex gap-2 w-full rtl:flex-row-reverse">
                        <Field className={"max-w-20"}>
                            <FieldLabel htmlFor="form-country">{t('label.country')}</FieldLabel>
                            <Select defaultValue="us">
                                <SelectTrigger id="form-country">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="us">+33</SelectItem>
                                    <SelectItem value="uk">United Kingdom</SelectItem>
                                    <SelectItem value="ca">Canada</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="form-phone">{t('label.phone')}</FieldLabel>
                            <Input id="form-phone" type="tel" placeholder="06 12 23 45 56" />
                        </Field>
                    </div>
                </div>

                {/* Login button */}
                <Button
                    onClick={handleLogin}
                    className="w-full rounded-xl h-11"
                >
                    {t("action.auth.phone")}
                </Button>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="px-3 text-xs text-gray-400">OR</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Social logins */}
                <div className="flex flex-col gap-3">
                    <Button
                        variant="outline"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-2 rounded-xl h-11"
                    >
                        <img src="/google.svg" alt="" className={"h-6 w-6"}/>
                        <p>{t("action.auth.google")}</p>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleFacebookLogin}
                        className="w-full flex items-center justify-center gap-2 rounded-xl h-11"
                    >
                        <img src="/facebook.svg" alt="" className={"h-6 w-6"}/>
                        <p>{t("action.auth.facebook")}</p>
                    </Button>
                </div>
            </div>
        </main>
    );
};