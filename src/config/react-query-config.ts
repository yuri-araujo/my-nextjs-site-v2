import { QueryClientConfig } from "react-query"

const QueryConfig: QueryClientConfig = {
    defaultOptions: {
        queries: {
            retryDelay: 5000,
            retry: 3,
        },
    },
}

export { QueryConfig }
