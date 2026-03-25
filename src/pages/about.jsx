import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import { StructuredData } from '@/components/StructuredData'
import {
  BlueSkyIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon
} from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpg'

function SocialLink({ className, href, children, icon: Icon }) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export default function About() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL

  return (
    <>
      <Head>
        <title>About - Jethro May</title>
        <meta
          name="description"
          content="Technology leader and Partner at FINN Partners UK, leading global development teams and building AI-first engineering workflows. Writing about engineering leadership and scaling agency dev teams."
        />
        <link rel="canonical" href={`${baseUrl}/about`} />
        <meta property="og:url" content={`${baseUrl}/about`} />
        <meta property="og:type" content="profile" />
        <meta property="og:title" content="About - Jethro May" />
        <meta property="og:description" content="Technology leader and Partner at FINN Partners UK, leading global development teams and building AI-first engineering workflows. Writing about engineering leadership and scaling agency dev teams." />
        <meta property="og:image" content={`${baseUrl}/me.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About - Jethro May" />
        <meta name="twitter:description" content="Technology leader and Partner at FINN Partners UK, leading global development teams and building AI-first engineering workflows. Writing about engineering leadership and scaling agency dev teams." />
        <meta name="twitter:image" content={`${baseUrl}/me.jpg`} />
      </Head>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Jethro May',
          url: baseUrl,
          jobTitle: 'Partner, Head of Development',
          worksFor: {
            '@type': 'Organization',
            name: 'FINN Partners UK',
          },
          image: `${baseUrl}/me.jpg`,
          sameAs: [
            'https://github.com/jethromayuk/',
            'https://www.linkedin.com/in/jethromay/',
            'https://bsky.app/profile/jethromay.bsky.social',
          ],
        }}
      />
      <Container className="mt-16 sm:mt-32">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
          <div className="lg:pl-20">
            <div className="max-w-xs px-2.5 lg:max-w-none">
              <Image
                src={portraitImage}
                alt="Jethro May"
                sizes="(min-width: 1024px) 32rem, 20rem"
                className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
              />
            </div>
          </div>
          <div className="lg:order-first lg:row-span-2">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
              I'm Jethro May. I live in London, where I build the future.
            </h1>
            <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
              <p>
                I'm Partner, Head of Development at <Link href="https://finnpartners.com" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-teal-500">FINN Partners UK</Link>, a globally distributed agency with offices around the world. I lead and coordinate a globally distributed development team, managing projects across the full spectrum — from rapid internal tools to large-scale client platforms.
              </p>
              <p>
                My work spans technical consultation with key clients, translating complex requirements into scalable solutions, partnering with project management and stakeholders on goals and deliverables, and bridging the gap between technical teams and business stakeholders.
              </p>
              <p>
                Outside of work I'm passionate about open-source and AI-first development — how AI is fundamentally changing the way we build software. When I'm not at a keyboard I'm usually at the gym, training kickboxing, or out on a hike.
              </p>
            </div>
          </div>
          <div className="lg:pl-20">
            <ul role="list">
              <SocialLink href="https://github.com/jethromayuk/" icon={GitHubIcon} className="mt-4">
                Follow on GitHub
              </SocialLink>
              <SocialLink href="https://www.linkedin.com/in/jethromay/" icon={LinkedInIcon} className="mt-4">
                Follow on LinkedIn
              </SocialLink>
              <SocialLink href="https://bsky.app/profile/jethromay.bsky.social" icon={BlueSkyIcon} className="mt-4">
                Follow on Bluesky
              </SocialLink>
            </ul>
          </div>
        </div>
      </Container>
    </>
  )
}
