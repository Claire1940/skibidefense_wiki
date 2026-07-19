"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Crown,
  Gift,
  GraduationCap,
  Map as MapIcon,
  Newspaper,
  Sparkles,
  Star,
  Target,
  Ticket,
  Trophy,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Unified module header with theme-colored icon badge
function ModuleHeader({
  icon: Icon,
  title,
  intro,
}: {
  icon: LucideIcon;
  title: string;
  intro: string;
}) {
  return (
    <div className="text-center mb-8 md:mb-12 scroll-reveal">
      <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
        <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)]">
          <Icon className="h-6 w-6 md:h-7 md:w-7 text-[hsl(var(--nav-theme-light))]" />
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
          {title}
        </h2>
      </div>
      <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
        {intro}
      </p>
    </div>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

// Tools Grid navigation card -> section id mapping (8 modules)
const TOOLS_SECTION_IDS = [
  "codes",
  "beginner-guide",
  "units-tier-list",
  "units-list",
  "update-guide",
  "tower-strategy",
  "maps-guide",
  "gamepass-guide",
];

export default function HomePageClient({
  latestArticles,
  moduleLinkMap: _moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.skibidefense.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Skibi Defense Wiki",
        description:
          "Complete Skibi Defense Wiki covering units, upgrades, codes, waves, enemies, maps, and tower defense strategy for the Roblox game Skibi Defense.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Skibi Defense - Roblox Tower Defense",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Skibi Defense Wiki",
        alternateName: "Skibi Defense",
        url: siteUrl,
        description:
          "Complete Skibi Defense Wiki resource hub for units, upgrades, codes, waves, enemies, maps, and tower defense strategy guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Skibi Defense Wiki - Roblox Tower Defense",
        },
        sameAs: [
          "https://www.roblox.com/search?keyword=Skibi%20Defense",
          "https://www.roblox.com/community",
          "https://www.reddit.com/r/roblox/",
          "https://www.youtube.com/watch?v=15-9lFbp7D4",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Skibi Defense",
        gamePlatform: ["PC", "Roblox"],
        applicationCategory: "Game",
        genre: ["Strategy", "Tower Defense", "Action"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/search?keyword=Skibi%20Defense",
        },
      },
      {
        "@type": "VideoObject",
        name: "Roblox Skibi Defense - Gameplay Walkthrough",
        description:
          "Skibi Defense Roblox tower defense gameplay walkthrough — deploy units, upgrade defenses, and survive waves of Skibidi-style enemies.",
        uploadDate: "2024-01-24",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/15-9lFbp7D4",
        url: "https://www.youtube.com/watch?v=15-9lFbp7D4",
      },
    ],
  };

  // Accordion states
  const [updateExpanded, setUpdateExpanded] = useState<number | null>(0);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Tier display config (S/A/B)
  const tierStyles: Record<string, string> = {
    S: "bg-[hsl(var(--nav-theme)/0.2)] border-[hsl(var(--nav-theme)/0.5)] text-[hsl(var(--nav-theme-light))]",
    A: "bg-[hsl(var(--nav-theme)/0.12)] border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))]",
    B: "bg-white/5 border-border text-muted-foreground",
  };

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Gift className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/search?keyword=Skibi%20Defense"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 之后 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="15-9lFbp7D4"
              title="Roblox Skibi Defense - Gameplay Walkthrough"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards (模块导航区, 视频区之后) */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = TOOLS_SECTION_IDS[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* Module 1: Skibi Defense Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Gift}
            title={t.modules.skibiDefenseCodes.title}
            intro={t.modules.skibiDefenseCodes.intro}
          />

          {/* Code Cards */}
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {t.modules.skibiDefenseCodes.codes.map((c: any, index: number) => {
              const isActive = c.status === "Active";
              return (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)]">
                      <Ticket className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        isActive
                          ? "bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]"
                          : "bg-white/5 border-border text-muted-foreground"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="font-mono text-lg font-bold mb-1.5 break-all">
                    {c.code}
                  </p>
                  <p className="text-sm text-muted-foreground">{c.reward}</p>
                </div>
              );
            })}
          </div>

          {/* Redeem Steps */}
          <div className="scroll-reveal p-5 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <h3 className="font-bold text-base md:text-lg mb-4 text-center">
              {t.modules.skibiDefenseCodes.redeemTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {t.modules.skibiDefenseCodes.redeemSteps.map(
                (step: any, index: number) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                      <span className="text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">
                        {step.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              {t.modules.skibiDefenseCodes.expiredNote}
            </p>
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Skibi Defense Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={GraduationCap}
            title={t.modules.skibiDefenseBeginnerGuide.title}
            intro={t.modules.skibiDefenseBeginnerGuide.intro}
          />

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {t.modules.skibiDefenseBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Sparkles className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.skibiDefenseBeginnerGuide.quickTips.map(
                (tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{tip}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 3: Skibi Defense Units Tier List */}
      <section id="units-tier-list" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Trophy}
            title={t.modules.skibiDefenseUnitsTierList.title}
            intro={t.modules.skibiDefenseUnitsTierList.intro}
          />

          <div className="scroll-reveal space-y-4">
            {t.modules.skibiDefenseUnitsTierList.tiers.map(
              (tier: any, index: number) => (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden"
                >
                  <div
                    className={`flex items-center gap-3 px-4 py-3 border-b border-border ${tierStyles[tier.tier] || tierStyles.B}`}
                  >
                    <span className="text-2xl font-bold">{tier.tier}</span>
                    <span className="text-sm font-semibold">{tier.stage}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
                    {tier.units.map((unit: any, ui: number) => (
                      <div
                        key={ui}
                        className="p-4 bg-white/5 border border-border rounded-lg"
                      >
                        <h4 className="font-bold mb-1">{unit.name}</h4>
                        <p className="text-xs text-[hsl(var(--nav-theme-light))] font-medium mb-1.5">
                          {unit.role}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {unit.strength}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 4: Skibi Defense Units List */}
      <section id="units-list" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Users}
            title={t.modules.skibiDefenseUnitsList.title}
            intro={t.modules.skibiDefenseUnitsList.intro}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.skibiDefenseUnitsList.units.map(
              (unit: any, index: number) => (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-lg">{unit.name}</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        unit.rarity === "Legendary"
                          ? "bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]"
                          : unit.rarity === "Rare"
                            ? "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)]"
                            : "bg-white/5 border-border text-muted-foreground"
                      }`}
                    >
                      {unit.rarity}
                    </span>
                  </div>
                  <p className="text-xs text-[hsl(var(--nav-theme-light))] font-medium mb-2">
                    {unit.role}
                  </p>
                  <ul className="space-y-1 mb-3">
                    {unit.abilities.map((ability: string, ai: number) => (
                      <li
                        key={ai}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                        {ability}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground border-t border-border pt-2">
                    {unit.upgradePath}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 5: Skibi Defense Update Guide */}
      <section id="update-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-3xl">
          <ModuleHeader
            icon={Newspaper}
            title={t.modules.skibiDefenseUpdateGuide.title}
            intro={t.modules.skibiDefenseUpdateGuide.intro}
          />

          <div className="scroll-reveal space-y-3">
            {t.modules.skibiDefenseUpdateGuide.updates.map(
              (item: any, index: number) => {
                const open = updateExpanded === index;
                return (
                  <div
                    key={index}
                    className="border border-border rounded-xl overflow-hidden bg-white/5"
                  >
                    <button
                      onClick={() =>
                        setUpdateExpanded(open ? null : index)
                      }
                      className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="font-semibold flex items-center gap-2">
                        <Star className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                        {item.title}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    {open && (
                      <div className="px-4 md:px-5 pb-4 md:pb-5 text-sm text-muted-foreground">
                        {item.content}
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Module 6: Skibi Defense Tower Strategy */}
      <section id="tower-strategy" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Target}
            title={t.modules.skibiDefenseTowerStrategy.title}
            intro={t.modules.skibiDefenseTowerStrategy.intro}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.skibiDefenseTowerStrategy.strategies.map(
              (s: any, index: number) => (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)]">
                      <Target className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <h4 className="font-bold">{s.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {s.description}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 7: Skibi Defense Maps Guide */}
      <section id="maps-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={MapIcon}
            title={t.modules.skibiDefenseMapsGuide.title}
            intro={t.modules.skibiDefenseMapsGuide.intro}
          />

          {/* Desktop table */}
          <div className="scroll-reveal hidden md:block overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] border-b border-[hsl(var(--nav-theme)/0.3)]">
                  <th className="text-left p-4 font-semibold">
                    {t.modules.skibiDefenseMapsGuide.mapColumns.map}
                  </th>
                  <th className="text-left p-4 font-semibold">
                    {t.modules.skibiDefenseMapsGuide.mapColumns.difficulty}
                  </th>
                  <th className="text-left p-4 font-semibold">
                    {t.modules.skibiDefenseMapsGuide.mapColumns.enemyPattern}
                  </th>
                  <th className="text-left p-4 font-semibold">
                    {
                      t.modules.skibiDefenseMapsGuide.mapColumns
                        .recommendedStrategy
                    }
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.modules.skibiDefenseMapsGuide.maps.map(
                  (m: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b border-border last:border-b-0 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 font-semibold">{m.map}</td>
                      <td className="p-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${
                            m.difficulty === "Insane" || m.difficulty === "Hard"
                              ? "bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]"
                              : "bg-white/5 border-border text-muted-foreground"
                          }`}
                        >
                          {m.difficulty}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {m.enemyPattern}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {m.recommendedStrategy}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="scroll-reveal md:hidden space-y-3">
            {t.modules.skibiDefenseMapsGuide.maps.map(
              (m: any, index: number) => (
                <div
                  key={index}
                  className="p-4 bg-white/5 border border-border rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">{m.map}</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        m.difficulty === "Insane" || m.difficulty === "Hard"
                          ? "bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]"
                          : "bg-white/5 border-border text-muted-foreground"
                      }`}
                    >
                      {m.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    <span className="text-foreground font-medium">
                      {t.modules.skibiDefenseMapsGuide.mapColumns.enemyPattern}:
                    </span>{" "}
                    {m.enemyPattern}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">
                      {
                        t.modules.skibiDefenseMapsGuide.mapColumns
                          .recommendedStrategy
                      }
                      :
                    </span>{" "}
                    {m.recommendedStrategy}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 8: Skibi Defense Gamepass Guide */}
      <section id="gamepass-guide" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Crown}
            title={t.modules.skibiDefenseGamepass.title}
            intro={t.modules.skibiDefenseGamepass.intro}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.skibiDefenseGamepass.gamepasses.map(
              (g: any, index: number) => (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    <h4 className="font-bold">{g.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {g.description}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.roblox.com/community"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/Roblox"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/roblox/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/search?keyword=Skibi%20Defense"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href={`/${locale}/about`}
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/privacy-policy`}
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/terms-of-service`}
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/copyright`}
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
