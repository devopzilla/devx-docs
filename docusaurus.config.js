// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Develop faster. Deploy anywhere.',
    // tagline: 'Make ALL your configurations portable and easy to use.',
    // tagline: 'A single meta-configuration tool to generate, share, and validate ALL your workflows and configurations.',
    tagline: 'A single configuration tool to generate, share, and validate ALL your workflows and infrastructure code.',
    url: 'https://docx.guku.io',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'devopzilla', // Usually your GitHub org/user name.
    projectName: 'devx', // Usually your repo name.

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    // editUrl:
                    //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                },
                // blog: {
                //     showReadingTime: true,
                //     routeBasePath: "/tutorials",
                //     path: "./tutorials",
                //     // Please change this to your repo.
                //     // Remove this to remove the "edit this page" links.
                //     // editUrl:
                //     //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                // },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            announcementBar: {
                id: 'taskfile-1',
                content:
                    'DevX now supports <a target="_blank" href="https://taskfile.dev">Taskfiles</a> to run and share your workflows, <a href="/docs/workflows-taskfile">check the docs</a>.',
                backgroundColor: 'var(--ifm-color-primary)',
                textColor: 'var(--cta-color)',
                isCloseable: true,
            },
            navbar: {
                title: 'DevX',
                // logo: {
                //     alt: 'My Site Logo',
                //     src: 'img/logo.svg',
                // },
                items: [
                    {
                        type: 'doc',
                        docId: 'intro',
                        position: 'left',
                        label: 'Docs',
                    },
                    {
                        to: 'tutorials',
                        position: 'left',
                        label: 'Tutorials',
                    },
                    {
                        href: 'https://github.com/devopzilla/GUKU-devx',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            footer: {
                // style: 'dark',
                links: [
                    // {
                    //     title: 'Docs',
                    //     items: [
                    //         {
                    //             label: 'Docs',
                    //             to: '/docs/intro',
                    //         },
                    //     ],
                    // },
                    // {
                    //     title: 'Community',
                    //     items: [
                    //         {
                    //             label: 'Slack',
                    //             href: 'https://stackoverflow.com/questions/tagged/docusaurus',
                    //         },
                    //         {
                    //             label: 'Discord',
                    //             href: 'https://discordapp.com/invite/docusaurus',
                    //         },
                    //         {
                    //             label: 'Twitter',
                    //             href: 'https://twitter.com/docusaurus',
                    //         },
                    //     ],
                    // },
                    // {
                    //     title: 'More',
                    //     items: [
                    //         // {
                    //         //     label: 'Blog',
                    //         //     to: '/blog',
                    //         // },
                    //         {
                    //             label: 'GitHub',
                    //             href: 'https://github.com/devopzilla/GUKU-devx',
                    //         },
                    //     ],
                    // },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} Devopzilla. Built with Docusaurus.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
                additionalLanguages: ['hcl', 'yaml', 'cue'],
            },
        }),

    plugins: [
        [
            '@docusaurus/plugin-content-blog',
            {
                id: 'tutorials',
                routeBasePath: 'tutorials',
                path: './tutorials',
            },
        ],
    ],
};

module.exports = config;
