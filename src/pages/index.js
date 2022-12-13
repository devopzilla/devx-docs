import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import ReactFlow, { Handle } from 'reactflow';
import 'reactflow/dist/style.css';
import './index.module.css';
import styles from './index.module.css';


function CustomNode({ data }) {
    return (
        <div className={clsx(styles.node)}>
            <div>
                {data.label}
            </div>
            <Handle className={clsx(styles.handle)} type="source" id="right" position="right" isConnectable={false} />
            <Handle className={clsx(styles.handle)} type="source" id="top" position="top" isConnectable={false} />
            <Handle className={clsx(styles.handle)} type="target" id="left" position="left" isConnectable={false} />
            <Handle className={clsx(styles.handle)} type="source" id="bottom" position="bottom" isConnectable={false} />
        </div>
    );
}

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();

    const nodeTypes = {
        custom: CustomNode
    }

    const nodes = [
        {
            id: 'devx',
            position: { x: 200, y: 0 },
            data: { label: 'guku DevX file', isSource: true, isSink: true },
            type: 'custom',
        },
        {
            id: 'dev',
            position: { x: 400, y: -100 },
            data: { label: 'Development Environment', isSink: true },
            type: 'custom',
        },
        {
            id: 'prod',
            position: { x: 400, y: 0 },
            data: { label: 'Production Deployment', isSink: true },
            type: 'custom',
        },
        {
            id: 'cloud',
            position: { x: 400, y: 100 },
            data: { label: 'Cloud Resources', isSink: true },
            type: 'custom',
        },
        {
            id: 'ci',
            position: { x: 200, y: -100 },
            data: { label: 'CI/CD Pipelines', isSink: true },
            type: 'custom',
        },
        {
            id: 'pol',
            position: { x: 200, y: 100 },
            data: { label: 'Security Policies', isSink: true },
            type: 'custom',
        },
    ];

    const edgeCommon = {
        animated: true,
        focusable: false,
        style: {
            stroke: "var(--cta-color)",
            strokeWidth: "2px"
        },
        markerEnd: {
            type: 'arrowclosed',
            color: "#000",
            strokeWidth: 3,
        },
    }

    const edges = [
        {
            id: '1-2',
            source: 'file',
            target: 'devx',
            ...edgeCommon
        },
        {
            id: '2-3',
            source: 'devx',
            target: 'prod',
            ...edgeCommon
        },
        {
            id: '2-4',
            source: 'devx',
            target: 'cloud',
            ...edgeCommon
        },
        {
            id: '2-5',
            source: 'devx',
            target: 'dev',
            ...edgeCommon
        },
        {
            id: '2-6',
            source: 'devx',
            target: 'ci',
            sourceHandle: 'top',
            targetHandle: 'bottom',
            ...edgeCommon
        },
        {
            id: '2-7',
            source: 'devx',
            target: 'pol',
            sourceHandle: 'bottom',
            targetHandle: 'top',
            ...edgeCommon
        },
    ];

    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                {/* <h1 className="hero__title">{siteConfig.title}</h1> */}
                <div style={{ height: '50vh', width: '100%' }}>
                    <ReactFlow
                        panOnDrag={false}
                        zoomOnScroll={false}
                        zoomOnPinch={false}
                        zoomOnDoubleClick={false}
                        preventScrolling={false}
                        fitView={true}
                        proOptions={{ hideAttribution: true }}
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                    >
                    </ReactFlow>
                </div>

                <br />
                {/* 
                <p className="hero__subtitle">
                    Standardise how developers run apps. Enable infrastructure self-service.
                    <br />
                    Scale DevOps.
                </p> */}


                <div className={styles.buttons}>
                    <Link
                        className={clsx('button button--secondary button--lg', styles.cta)}
                        to="https://github.com/devopzilla/guku-devx">
                        🌟 star us on GitHub
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default function Home() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={`${siteConfig.title}`}
            description="Guku DevX is a tool for building developer-centric interfaces for your internal developer platform (IDP). Use DevX to standardise how developers run apps and enable infrastructure self-service. <head />">
            <HomepageHeader />
            <main>
                <HomepageFeatures />
            </main>
        </Layout>
    );
}
