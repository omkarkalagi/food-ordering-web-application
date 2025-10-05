import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";

interface UseAppwriteOptions<T, P extends Record<string, unknown>> {
    fn: (params: P) => Promise<T>;
    params?: P;
    skip?: boolean;
    immediate?: boolean;
}

interface UseAppwriteReturn<T, P> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: (newParams?: P) => Promise<void>;
    reset: () => void;
}

const useAppwrite = <T, P extends Record<string, unknown>>({
                                                                       fn,
                                                                       params = {} as P,
                                                                       skip = false,
                                                                       immediate = true,
                                                                   }: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(immediate && !skip);
    const [error, setError] = useState<string | null>(null);
    const cachedParams = useRef<P>(params);

    const normalizedParams = useMemo(() => ({ ...params }), [params]);

    const fetchData = useCallback(
        async (fetchParams: P) => {
            setLoading(true);
            setError(null);

            try {
                const result = await fn({ ...fetchParams });
                setData(result);
            } catch (err: unknown) {
                const errorMessage =
                    err instanceof Error ? err.message : "An unknown error occurred";
                setError(errorMessage);
                Alert.alert("Error", errorMessage);
            } finally {
                setLoading(false);
            }
        },
        [fn]
    );

    useEffect(() => {
        cachedParams.current = normalizedParams;
    }, [normalizedParams]);

    useEffect(() => {
        if (!skip && immediate) {
            fetchData(cachedParams.current);
        }
    }, [skip, immediate, fetchData]);

    const refetch = async (newParams?: P) => {
        const paramsToUse = newParams ?? cachedParams.current;
        cachedParams.current = paramsToUse as P;
        await fetchData(paramsToUse as P);
    };

    const reset = () => {
        setData(null);
        setError(null);
        cachedParams.current = params;
    };

    return { data, loading, error, refetch, reset };
};

export default useAppwrite;
