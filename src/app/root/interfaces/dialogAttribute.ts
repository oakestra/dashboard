import { DialogAction } from '../enums/dialogAction';
import { IApplication } from './application';
import { IUser } from './user';

export interface IDialogAttribute {
    action?: DialogAction;
    content?: IApplication | IUser | undefined;
}
