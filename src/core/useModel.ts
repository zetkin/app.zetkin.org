import { useEffect, useState } from "react";
import { useStore } from "react-redux";
import { RootState, Store } from "./store";

export interface UseModelFactory<ModelType> {
    (store: Store): ModelType;
}

export default function useModel<ModelType>(factory: UseModelFactory<ModelType>) {
    const store = useStore<RootState>();
    const [model, setModel] = useState(() => factory(store));

    console.log('rendering');

    useEffect(() => {
        console.log('Creating store model');
        const unsubscribe = store.subscribe(() => {
            console.log('triggering re-render')
            setModel(model);
        });

        return () => {
            unsubscribe();
        };
    }, [])

    return model;
}