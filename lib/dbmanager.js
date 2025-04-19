
const db = require("./db");

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

function getFields(group) {
    const fields = [];
    const data = fs.readFileSync('../settings.conf', 'utf8');

    if (group == "SKB") {
        const SKB_table = JSON.parse(data).SKB_table;
        for (let i = 0; i < SKB_table.length; i++) {
            // addField(SKB_table[i].header);

            if (SKB_table[i].sub_heading.length > 0) {
                for (let j = 0; j < SKB_table[i].sub_heading.length; j++) {
                    // addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
                    fields.push(camelize((SKB_table[i].header + SKB_table[i].sub_heading[j]).toString()));
                }
            } else {
                fields.push(camelize(SKB_table[i].header));
            }
        }
    } else if (group == "Sapphire") {
        const Sapphire_table = JSON.parse(data).Sapphire_table;
        for (let i = 0; i < Sapphire_table.length; i++) {
            // addField(SKB_table[i].header);

            if (Sapphire_table[i].sub_heading.length > 0) {
                for (let j = 0; j < Sapphire_table[i].sub_heading.length; j++) {
                    // addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
                    fields.push(camelize((Sapphire_table[i].header + Sapphire_table[i].sub_heading[j]).toString()));
                }
            } else {
                fields.push(camelize(Sapphire_table[i].header));
            }
        }
    }

    return fields;
}

class DBManager {
    
    async getCollectionData(group, year, week) {
        var collection = "";

        if (group == "SKB") {
            collection = "users";
        } else {
            collection = "sapphire";
        }

        const snapshot = await db.collection(collection).listDocuments();

        const docArray = [];

        for (let i = 0; i < snapshot.length; i++) {

            const snap = await db.collection(collection).doc(snapshot[i].id).collection(year).doc(week).get();

            var dataRow = "{";
            dataRow += ' "sl" : "' + (i + 1) + '",';
            dataRow += ' "name" : "' + snapshot[i].id + '",';
            var fields = getFields(group);
            fields.push("remarks");

            console.log(fields);

            for (let i = 0; i < fields.length; i++) {
                dataRow += '"' + fields[i] + '" : "' + snap.data()[fields[i]] + '"';
                // dataRow.push(snap.data()[fields[i]]);
                if (i != fields.length - 1) {
                    dataRow += ',';
                }
            }
            dataRow += '}';

            docArray.push(JSON.parse(dataRow));

        }

        console.log(docArray);
        return docArray;
    }

    async getUserNames() {
        const snapshot = await db.collection("users").listDocuments();
        const docArray = [];
        for (let i = 0; i < snapshot.length; i++) {
            const namelist_link = await db.collection("users").doc(snapshot[i].id).get();
            // console.log(namelist_link.data());
            docArray.push({ name: snapshot[i].id, namelist: namelist_link.data().namelist_link });
        }
        return docArray;
    }

    async getUserNamesSapphire() {
        const snapshot = await db.collection("sapphire").listDocuments();
        const docArray = [];
        for (let i = 0; i < snapshot.length; i++) {
            docArray.push({ name: snapshot[i].id });
        }
        return docArray;
    }

    async getAnalyzeData(year, weekFrom, weekTo, name, group) {
        const docArray = [];
        const idArray = [];

        if (group == "SKB") {
            const snapshot = await db.collection("users").doc(name.toString()).collection(year.toString()).listDocuments();
            let sl = 1;

            for (let i = 1; i <= snapshot.length; i++) {
                if (parseInt(snapshot[i - 1].id) >= parseInt(weekFrom) && parseInt(snapshot[i - 1].id) <= parseInt(weekTo)) {
                    idArray.push(parseInt(snapshot[i - 1].id));
                }
            }

            idArray.sort(function (a, b) { return a - b });

            for (let j = 0; j < idArray.length; j++) {
                const snap = await db.collection("users").doc(name.toString()).collection(year.toString()).doc(idArray[j].toString()).get();

                var dataRow = "{";
                dataRow += ' "sl" : "' + sl + '",';
                dataRow += ' "week" : "Week ' + parseInt(idArray[j]) + '",';
                var fields = this.getFields(group);

                for (let i = 0; i < fields.length; i++) {
                    dataRow += '"' + fields[i] + '" : "' + snap.data()[fields[i]] + '"';
                    // dataRow.push(snap.data()[fields[i]]);
                    if (i != fields.length - 1) {
                        dataRow += ',';
                    }
                }
                dataRow += '}';

                sl++;

                docArray.push(JSON.parse(dataRow));
            }
        } else {
            const snapshot = await db.collection("sapphire").doc(name.toString()).collection(year.toString()).listDocuments();
            let sl = 1;

            for (let i = 1; i <= snapshot.length; i++) {
                if (parseInt(snapshot[i - 1].id) >= parseInt(weekFrom) && parseInt(snapshot[i - 1].id) <= parseInt(weekTo)) {
                    idArray.push(parseInt(snapshot[i - 1].id));
                }
            }

            idArray.sort(function (a, b) { return a - b });

            for (let j = 0; j < idArray.length; j++) {
                const snap = await db.collection("sapphire").doc(name.toString()).collection(year.toString()).doc(idArray[j].toString()).get();

                var dataRow = "{";
                dataRow += ' "sl" : "' + sl + '",';
                dataRow += ' "week" : "Week ' + parseInt(idArray[j]) + '",';
                var fields = this.getFields(group);

                for (let i = 0; i < fields.length; i++) {
                    dataRow += '"' + fields[i] + '" : "' + snap.data()[fields[i]] + '"';
                    // dataRow.push(snap.data()[fields[i]]);
                    if (i != fields.length - 1) {
                        dataRow += ',';
                    }
                }
                dataRow += '}';

                sl++;

                docArray.push(JSON.parse(dataRow));
            }
        }

        // console.log(docArray);
        return docArray;
    }

    async getClosings() {
        const snapshot = await db.collection("closings").listDocuments();

        const docArray = [];
        for (let i = 0; i < snapshot.length; i++) {

            const snap = await db.collection("closings").doc(snapshot[i].id).get();

            docArray.push({
                id: snapshot[i].id,
                irName: snap.data().irName,
                prosName: snap.data().prosName,
                uv: snap.data().uv,
                node: snap.data().node,
                status: snap.data().status
            });
        }
        return docArray;
    }

    updateUser(name, week, year, fieldName, value, group) {
        var userJson = '{"' + fieldName + '" : ' + value + '}';
        if (fieldName == "remarks") {
            userJson = '{"' + fieldName + '" : "' + value + '"}';
        }
        // console.log(userJson);
        const obj = JSON.parse(userJson);
        // console.log(obj);

        if (group == "SKB") {
            db.collection("users").doc(name).collection(year).doc(week).update(obj);
        } else {
            db.collection("sapphire").doc(name).collection(year).doc(week).update(obj);
        }
    }

}

const dbm = new DBManager();

module.exports = dbm;
