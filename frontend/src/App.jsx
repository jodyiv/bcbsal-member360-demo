import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import {
  Content,
  Header,
  HeaderContainer,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavDivider,
  Loading
} from '@carbon/react'
import {
  Dashboard,
  DataStructured,
  WatsonHealthAiResults,
  ReportData,
  ChartNetwork,
  Notification,
  UserAvatar,
  Document
} from '@carbon/icons-react'
import DemoBanner from './components/DemoBanner.jsx'
import '@carbon/charts/styles.css'

const ExecutivePage    = lazy(() => import('./pages/ExecutivePage.jsx'))
const IngestionPage    = lazy(() => import('./pages/IngestionPage.jsx'))
const Member360Page    = lazy(() => import('./pages/Member360Page.jsx'))
const GovernancePage   = lazy(() => import('./pages/GovernancePage.jsx'))
const ArchitecturePage = lazy(() => import('./pages/ArchitecturePage.jsx'))

const FallbackLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
    <Loading description="Loading page…" withOverlay={false} />
  </div>
)

export default function App() {
  return (
    <div className="bcbsal-shell">
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <>
            <Header aria-label="BCBS Alabama Member 360 Platform">
              <SkipToContent />
              <HeaderMenuButton
                aria-label={isSideNavExpanded ? 'Close menu' : 'Open menu'}
                onClick={onClickSideNavExpand}
                isActive={isSideNavExpanded}
                aria-expanded={isSideNavExpanded}
              />
              <HeaderName href="/" prefix="IBM">
                BCBS AL · Member 360 Lakehouse
              </HeaderName>
              <HeaderNavigation aria-label="Main navigation">
                <HeaderMenuItem href="/">Executive Dashboard</HeaderMenuItem>
                <HeaderMenuItem href="/ingestion">Lakehouse Ingestion</HeaderMenuItem>
                <HeaderMenuItem href="/member360">Member 360</HeaderMenuItem>
                <HeaderMenuItem href="/governance">Governance & Lineage</HeaderMenuItem>
                <HeaderMenuItem href="/architecture">Architecture</HeaderMenuItem>
              </HeaderNavigation>
              <HeaderGlobalBar>
                <HeaderGlobalAction aria-label="Notifications" tooltipAlignment="end">
                  <Notification size={20} />
                </HeaderGlobalAction>
                <HeaderGlobalAction aria-label="User profile" tooltipAlignment="end">
                  <UserAvatar size={20} />
                </HeaderGlobalAction>
              </HeaderGlobalBar>
              <SideNav
                aria-label="Side navigation"
                expanded={isSideNavExpanded}
                isPersistent={false}
                onSideNavBlur={onClickSideNavExpand}
              >
                <SideNavItems>
                  <SideNavLink renderIcon={Dashboard}      href="/"             isActive={window.location.pathname === '/'}>Executive Dashboard</SideNavLink>
                  <SideNavLink renderIcon={DataStructured} href="/ingestion"    isActive={window.location.pathname === '/ingestion'}>Lakehouse Ingestion</SideNavLink>
                  <SideNavLink renderIcon={WatsonHealthAiResults} href="/member360" isActive={window.location.pathname === '/member360'}>Member 360</SideNavLink>
                  <SideNavLink renderIcon={ChartNetwork}   href="/governance"   isActive={window.location.pathname === '/governance'}>Governance & Lineage</SideNavLink>
                  <SideNavDivider />
                  <SideNavLink renderIcon={ReportData}     href="/architecture" isActive={window.location.pathname === '/architecture'}>Architecture</SideNavLink>
                </SideNavItems>
              </SideNav>
            </Header>

            <DemoBanner />

            <Content className="bcbsal-content">
              <Suspense fallback={<FallbackLoader />}>
                <Routes>
                  <Route path="/"            element={<ExecutivePage />} />
                  <Route path="/ingestion"   element={<IngestionPage />} />
                  <Route path="/member360"   element={<Member360Page />} />
                  <Route path="/governance"  element={<GovernancePage />} />
                  <Route path="/architecture" element={<ArchitecturePage />} />
                </Routes>
              </Suspense>
            </Content>
          </>
        )}
      />
    </div>
  )
}
