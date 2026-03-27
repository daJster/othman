import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export interface FooterProps {
  variant?: 'simple' | 'extended'
}

export function Footer({ variant = 'simple' }: FooterProps) {
  const { t } = useTranslation('common')

  if (variant === 'simple') {
    return (
      <footer className="py-8 px-4 bg-green-900 text-green-100 text-center">
        <p>© {new Date().getFullYear()} {t('appName')}. {t('copyright')}</p>
      </footer>
    )
  }

  return <ExtendedFooter />
}

function ExtendedFooter() {
  const { t } = useTranslation('common')
  const footer = t('footer', { returnObjects: true }) as {
    about: string
    aboutDesc: string
    quickLinks: string
    home: string
    quran: string
    tafsir: string
    features: string
    contact: string
    resources: string
    resourcesDesc: string
    mobileApp: string
    download: string
    desktopApp: string
    install: string
    legal: string
    terms: string
    privacy: string
    cookies: string
    faq: string
    subscribe: string
    subscribeDesc: string
    email: string
    subscribeBtn: string
    social: string
    madeWith: string
    love: string
    for: string
  }

  return (
    <footer className="bg-gray-100 dark:bg-green-900 text-green-100 w-full">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{footer.about}</h3>
            <p className="text-green-300 text-sm">
              {footer.aboutDesc}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{footer.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-green-300 hover:text-white transition-colors">
                  {footer.home}
                </Link>
              </li>
              <li>
                <Link to="/quran" className="text-green-300 hover:text-white transition-colors">
                  {footer.quran}
                </Link>
              </li>
              <li>
                <Link to="/tafsir" className="text-green-300 hover:text-white transition-colors">
                  {footer.tafsir}
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-green-300 hover:text-white transition-colors">
                  {footer.features}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-green-300 hover:text-white transition-colors">
                  {footer.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{footer.resources}</h3>
            <ul className="space-y-2">
              <li className="text-green-300">
                {footer.resourcesDesc}
              </li>
              <li>
                <Link to="/app" className="text-green-300 hover:text-white transition-colors">
                  {footer.mobileApp}
                </Link>
              </li>
              <li>
                <Link to="/download" className="text-green-300 hover:text-white transition-colors">
                  {footer.download}
                </Link>
              </li>
              <li>
                <Link to="/desktop" className="text-green-300 hover:text-white transition-colors">
                  {footer.desktopApp}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{footer.legal}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-green-300 hover:text-white transition-colors">
                  {footer.terms}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-green-300 hover:text-white transition-colors">
                  {footer.privacy}
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-green-300 hover:text-white transition-colors">
                  {footer.cookies}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-green-300 hover:text-white transition-colors">
                  {footer.faq}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-green-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{footer.subscribe}</h3>
              <p className="text-green-300 text-sm">{footer.subscribeDesc}</p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={footer.email}
                className="bg-green-800 border border-green-700 text-green-100 placeholder:text-green-400 px-4 py-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Button className="bg-white text-green-900 hover:bg-green-100">
                {footer.subscribeBtn}
              </Button>
            </div>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="mt-8 pt-8 border-t border-green-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-green-300 text-sm">
            © {new Date().getFullYear()} {t('appName')}. {t('copyright')}
          </p>
          <div className="flex items-center gap-2 text-green-300 text-sm">
            <span>{footer.madeWith}</span>
            <span className="text-red-400">❤️</span>
            <span>{footer.love}</span>
            <span>{footer.for}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}