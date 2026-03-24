import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {Footer} from "@/components/footer.tsx";

export function HomePage() {
  const { t } = useTranslation('common')

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-sm font-medium text-green-700 tracking-widest uppercase">
            {t('tagline')}
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-green-900">
            {t('heroTitle')}
          </h1>
          <p className="text-xl text-green-700">
            {t('heroSubtitle')}
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('heroDescription')}
          </p>
          <div className="flex gap-4 justify-center pt-6">
            <Button size="lg">{t('cta')}</Button>
            <Button variant="outline" size="lg">{t('readQuran')}</Button>
          </div>
        </div>
      </section>

      {/* Featured Verse Section */}
      <section className="py-16 px-4 bg-green-100/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-8 text-green-800">{t('verseOfTheDay')}</h2>
          <Card className="bg-white border-green-200 shadow-lg">
            <CardContent className="pt-6">
              <p className="text-3xl font-medium text-green-900 leading-relaxed mb-4">
                {t('verse3')}
              </p>
              <p className="text-muted-foreground">
                {t('verse3Ref')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Miracles Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-900">{t('miracles')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MiracleCard
              title={t('miracles')}
              description={t('miraclesDesc')}
              icon="📖"
            />
            <MiracleCard
              title={t('scientific')}
              description={t('scientificDesc')}
              icon="🔬"
            />
            <MiracleCard
              title={t('linguistic')}
              description={t('linguisticDesc')}
              icon="🎯"
            />
            <MiracleCard
              title={t('prophecy')}
              description={t('prophecyDesc')}
              icon="📡"
            />
          </div>
        </div>
      </section>

      {/* Quranic Verses Section */}
      <section className="py-16 px-4 bg-green-50">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center text-green-900">{t('appName')}</h2>
          
          <div className="space-y-6">
            <Card className="bg-white border-l-4 border-green-600">
              <CardContent className="pt-6">
                <p className="text-lg font-medium text-green-800 mb-2">{t('verse1')}</p>
                <p className="text-sm text-muted-foreground">{t('verse1Ref')}</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-l-4 border-green-600">
              <CardContent className="pt-6">
                <p className="text-lg font-medium text-green-800 mb-2">{t('verse2')}</p>
                <p className="text-sm text-muted-foreground">{t('verse2Ref')}</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-l-4 border-green-600">
              <CardContent className="pt-6">
                <p className="text-lg font-medium text-green-800 mb-2">{t('verse4')}</p>
                <p className="text-sm text-muted-foreground">{t('verse4Ref')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-900">{t('features')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title={t('readQuran')}
              description={t('readQuranDesc')}
            />
            <FeatureCard
              title={t('tafsir')}
              description={t('tafsirDesc')}
            />
            <FeatureCard
              title={t('search')}
              description={t('searchDesc')}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-green-700 text-center text-white">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold">{t('cta')}</h2>
          <p className="text-green-100">
            {t('ctaDesc')}
          </p>
          <Button size="lg" className="mt-4 bg-white text-green-800 hover:bg-green-50">
            {t('cta')}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer variant={'extended'} />
    </div>
  )
}

function MiracleCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: string
}) {
  return (
    <Card className="text-center space-y-4 border-green-200 hover:border-green-400 transition-colors">
      <CardHeader>
        <div className="text-4xl">{icon}</div>
        <CardTitle className="text-green-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Card className="border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800 text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
