import {
  AppBridgeAction,
  DestructableAction,
  DisableableAction,
  LoadableAction,
} from '../../types';

export interface HeaderPrimaryAction
  extends DestructableAction,
    DisableableAction,
    LoadableAction,
    AppBridgeAction {}
