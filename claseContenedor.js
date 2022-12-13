const { captureRejections } = require('events');
const fs = require('fs');
const { mainModule } = require('process');

class Contenedor {

    constructor(name) {
        this.name = name;
    }

    async read() {
        try {
            let data = await fs.promises.readFile("./" + this.name, "utf-8");
            return data;
            
        } catch (error) {
            throw Error("Error al leer el archivo");
        }
    }

    async write(datos, msg) {
        try {
            await fs.promises.writeFile("./" + this.name, JSON.stringify(datos, null, 2));
            console.log(msg);
        } catch (error) {
            throw Error("Error al escribir en el archivo");
        }
    }


    async save(product) {
        try{
            let newId = 1;
            let newProduct = null;
    
            let data = await this.read();
            let datos = JSON.parse(data);
            if (data === '[]'){
                product.id = newId ;
                newProduct = [product];
                await this.write(newProduct, "Se agrego el primer producto");
            } else {
                product.id = datos[datos.length - 1].id + 1;
                newProduct = product;
                datos.push(newProduct);
                await this.write(datos, "Producto agregado correctamente");
            }
        }
        catch(error){
            throw Error("Error en el save");
        }

    }


    async getById(num) {
        try{
            let data = await this.read();
            let datos = JSON.parse(data);
    
            let result = datos.filter( product => product.id == num);
            return result;
        }
        catch(error){
            throw Error("Error en getById");
        }

    }

    async getAll() {
         try{
            let data = await this.read();
            let datos = JSON.parse(data);
    
            return datos;
        }
        catch(error){
            throw Error("Error en el getAll");
        };

    }

    async deleteById(num) {
        try{
            let data = await this.read();
            let datos = JSON.parse(data);
    
            let product = datos.find( product => product.id == num);
            
            if(product) {
                let index = datos.indexOf(product);
                datos.splice(index, 1);
                await this.write(datos, `Producto con ID: ${num} eliminado correctamente`);
            } else {
                console.log(`Producto con ID: ${num} no existe`);
                return [];
            }
        }
        catch(error){
            throw Error("Error en el deleteById");
        }

    }

    async deleteAll() {
        try{
            let data = [];
            await this.write(data, "Todos los productos eliminados");
        }
        catch(error){
            throw Error("Error en el deleteAll()");
        }
    }
    
    
}

module.exports = Contenedor;
