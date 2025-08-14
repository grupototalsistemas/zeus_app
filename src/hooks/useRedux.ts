import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';

// Hook tipado para useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Hook tipado para useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
