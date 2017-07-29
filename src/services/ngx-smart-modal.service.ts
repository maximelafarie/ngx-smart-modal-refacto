import {Injectable} from '@angular/core';
import {NgxSmartModalComponent} from '../components/ngx-smart-modal.component';
import {ModalInstance} from './modal-instance';

@Injectable()
export class NgxSmartModalService {
    public modalStack: ModalInstance[] = [];
    public modalData: any[] = [];

    /**
     * Add a new modal instance. This step is essential and allows to retrieve any modal at any time.
     * It stores an object that contains the given modal identifier and the modal itself directly in the `modalStack`.
     *
     * @param {ModalInstance} modalInstance The object that contains the given modal identifier and the modal itself.
     * @param {boolean} force Optional parameter that forces the overriding of modal instance if it already exists.
     * @returns {void} Returns nothing special.
     */
    public addModal(modalInstance: ModalInstance, force?: boolean): void {
        if (force) {
            const i: number = this.modalStack.findIndex((o: ModalInstance) => {
                return o.id === modalInstance.id;
            });
            if (i > -1) {
                this.modalStack[i].modal = modalInstance.modal;
            } else {
                this.modalStack.push(modalInstance);
            }
            return;
        }
        this.modalStack.push(modalInstance);
    }

    /**
     * Retrieve a modal instance by its identifier.
     *
     * @param {string} id The modal identifier used at creation time.
     */
    public getModal(id: string): NgxSmartModalComponent {
        return this.modalStack.filter((o: any) => {
            return o.id === id;
        })[0].modal;
    }

    /**
     * Retrieve all the created modals.
     *
     * @returns {Array} Returns an array that contains all modal instances.
     */
    public getModalStack(): ModalInstance[] {
        return this.modalStack;
    }

    /**
     * Retrieve all the opened modals. It looks for all modal instances with their `visible` property set to `true`.
     *
     * @returns {Array} Returns an array that contains all the opened modals.
     */
    public getOpenedModals(): ModalInstance[] {
        const modals: ModalInstance[] = [];
        this.modalStack.forEach((o: ModalInstance) => {
            if (o.modal.visible) {
                modals.push(o);
            }
        });
        return modals;
    }

    /**
     * Get the higher `z-index` value between all the modal instances. It iterates over the `ModalStack` array and
     * calculates a higher value (it takes the highest index value between all the modal instances and adds 1).
     * Use it to make a modal appear foreground.
     *
     * @returns {number} Returns a higher index from all the existing modal instances.
     */
    public getHigherIndex(): number {
        const index: number[] = [];
        const modals: ModalInstance[] = this.getOpenedModals();
        modals.forEach((o: ModalInstance) => {
            index.push(o.modal.layerPosition);
        });
        return Math.max(...index) + 1;
    }

    /**
     * It gives the number of modal instances. It's helpful to know if the modal stack is empty or not.
     *
     * @returns {number} Returns the number of modal instances.
     */
    public getModalStackCount(): number {
        return this.modalStack.length;
    }

    /**
     * Remove a modal instance from the modal stack.
     *
     * @param {string} id The modal identifier.
     * @returns {Array} Returns the removed modal instance.
     */
    public removeModal(id: string): void {
        const i: number = this.modalStack.findIndex((o: any) => {
            return o.id === id;
        });
        if (i > -1) {
            this.modalStack.splice(i, 1);
        }
    }

    /**
     * Associate data to an identified modal. If the modal isn't already associated to some data, it creates a new
     * entry in the `modalData` array with its `id` and the given `data`. If the modal already has data, it rewrites
     * them with the new ones. Finally if no modal found it returns an error message in the console and false value
     * as method output.
     *
     * @param {Object | Array | number | string | boolean} data The data you want to associate to the modal.
     * @param {string} id The modal identifier.
     * @returns {boolean} Returns true if data association succeeded, else returns false.
     */
    public setModalData(data: object | any[] | number | string | boolean, id: string): boolean {
        if (!!this.modalStack.find((o: ModalInstance) => {
                return o.id === id;
            })) {
            if (!!this.modalData.find((o) => {
                    return o.id === id;
                })) {
                setTimeout(() => this.modalData[this.modalData.findIndex((o) => o.id === id)].data = data);
            } else {
                setTimeout(() => this.modalData.push({data, id}));
            }
            return true;
        } else {
            return false;
        }
    }

    /**
     * Retrieve modal data by its identifier.
     *
     * @param {string} id The modal identifier used at creation time.
     * @returns {Object|Array|number|string|boolean|null} Returns the associated modal data.
     */
    public getModalData(id: string): object | any[] | number | string | boolean {
        return this.modalData.filter((o: any) => o.id === id);
    }

    /**
     * Retrieve all data associated to any modal.
     *
     * @returns {Array} Returns all modal data.
     */
    public getAllModalData(): any[] {
        return this.modalData;
    }

    /**
     * Reset the data attached to a given modal.
     *
     * @param {string} id The modal identifier used at creation time.
     * @returns {Array} Returns the removed data.
     */
    public resetModalData(id: string): void {
        const i: number = this.modalData.findIndex((o: any) => {
            return o.id === id;
        });
        if (i > -1) {
            this.modalData.splice(i, 1);
        }
    }

    /**
     * Reset all the modal data.
     * Use it wisely.
     */
    public resetAllModalData(): void {
        this.modalData = [];
    }
}
