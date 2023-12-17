"use client";
import React, { useState } from "react";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Provider({ children }: any) {
	const [client] = useState(new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } }));

	return (
		<>
			<QueryClientProvider client={client}>
				<ReactQueryStreamedHydration>
					{children}
				</ReactQueryStreamedHydration>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</>
	);
}

export { Provider };
