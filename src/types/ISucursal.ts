import DataModel from "./DataModel";
import IDomicilio from "./IDomicilio";
import IEmpresa from "./IEmpresa";

export default interface ISucursal extends DataModel<ISucursal>{
    nombre: string;
    horarioApertura: number;
    horarioCierre: number;
    domicilio: IDomicilio;
    empresa: IEmpresa;
}