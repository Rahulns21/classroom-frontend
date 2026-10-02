import {GitHubBanner, Refine, WelcomePage,} from "@refinedev/core";
import {DevtoolsPanel, DevtoolsProvider} from "@refinedev/devtools";
import {RefineKbar, RefineKbarProvider} from "@refinedev/kbar";

import {BrowserRouter, Outlet, Route, Routes} from "react-router";
import routerProvider, {DocumentTitleHandler, UnsavedChangesNotifier,} from "@refinedev/react-router";
import {dataProvider} from "./providers/data";
import {useNotificationProvider} from "./components/refine-ui/notification/use-notification-provider";
import {Toaster} from "./components/refine-ui/notification/toaster";
import {ThemeProvider} from "./components/refine-ui/theme/theme-provider";
import "./App.css";
import Dashboard from "@/pages/dashboard.tsx";
import {BookOpen, Home} from "lucide-react";
import {Layout} from "@/components/refine-ui/layout/layout.tsx";
import SubjectsList from "@/pages/subjects/list.tsx";
import SubjectsCreate from "@/pages/subjects/create.tsx";

function App() {
    return (
        <BrowserRouter>
            <RefineKbarProvider>
                <ThemeProvider>
                    <DevtoolsProvider>
                        <Refine
                            dataProvider={dataProvider}
                            notificationProvider={useNotificationProvider()}
                            routerProvider={routerProvider}
                            options={{
                                syncWithLocation: true,
                                warnWhenUnsavedChanges: true,
                                projectId: "JMqAcL-bdRp1U-06vXLP",
                            }}
                            resources={[
                                {
                                    name: "dashboard",
                                    list: '/',
                                    meta: {label: 'Home', icon: <Home/>}
                                },
                                {
                                    name: 'subjects',
                                    list: '/subjects',
                                    create: '/subjects/create',
                                    meta: { label: 'Subjects', icon: <BookOpen /> }
                                }
                            ]}
                        >
                            <Routes>
                                <Route element={<Layout>
                                    <Outlet/>
                                </Layout>}>
                                    <Route path="/" element={<Dashboard/>}/>
                                    <Route path="subjects">
                                        <Route index element={<SubjectsList />} />
                                        <Route path="create" element={<SubjectsCreate />} />
                                    </Route>
                                </Route>
                            </Routes>
                            <Toaster/>
                            <RefineKbar/>
                            <UnsavedChangesNotifier/>
                            <DocumentTitleHandler/>
                        </Refine>
                    </DevtoolsProvider>
                </ThemeProvider>
            </RefineKbarProvider>
        </BrowserRouter>
    );
}

export default App;
