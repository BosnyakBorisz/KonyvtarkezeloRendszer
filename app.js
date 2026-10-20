const kategoriak = ["Regény", "Sci-fi", "Történelmi", "Fantasy"];
const konyvek = [
    new Konyv("Egri csillagok", "Gárdonyi Géza", 1901, 650, "Történelmi"),
    new Konyv("A nagy Gatsby", "F. Scott Fitzgerald", 1925, 180, "Regény"),
    new Konyv("A kis herceg", "Antoine de Saint-Exupéry", 1943, 96, "Fantasy"),
    new Konyv("A Gyűrűk Ura: A Gyűrű Szövetsége", "J.R.R. Tolkien", 1954, 480, "Fantasy")
];

const konyvTablazatMegjelenites = document.getElementById("konyvTablazatMegjelenites");
const konyvHibaUzenet = document.getElementById("konyvHibaUzenet");
const konyvEredmeny = document.getElementById("konyvEredmeny");

let kivalasztottKategoria = "Mind";
let aktualisNezet = "osszes";

function Konyv(cim, szerzo, kiadasiEv, oldalszam, kategoria = "Regény") {
    this.cim = cim;
    this.szerzo = szerzo;
    this.kiadasiEv = Number(kiadasiEv);
    this.oldalszam = Number(oldalszam);
    this.kolcsonozve = false;
    this.kategoria = kategoriak.includes(kategoria) ? kategoria : "Regény";
    
    this.kolcsonoz = function () { if (!this.kolcsonozve) this.kolcsonozve = true; };
    this.visszahoz = function () { if (this.kolcsonozve) this.kolcsonozve = false; };
}

document.addEventListener("DOMContentLoaded", konyvekMegjelenitese);

function konyvekMegjelenitese() {
    konyvTablazatMegjelenites.replaceChildren();
    const listaMegjelenitesre = aktualisLista();

    if (listaMegjelenitesre.length === 0) {
        const sor = document.createElement("tr");
        sor.innerHTML = `<td colSpan="7" class="px-6 py-4 text-center text-gray-500">Nincs megjeleníthető könyv.</td>`;
        konyvTablazatMegjelenites.appendChild(sor);
        return;
    }

    listaMegjelenitesre.forEach(konyv => {
        const sor = document.createElement("tr");
        sor.className = "bg-white border-b border-gray-200 hover:bg-emerald-50";

        [konyv.cim, konyv.szerzo, konyv.kiadasiEv, konyv.oldalszam, konyv.kategoria].forEach((adat, index) => {
            const cella = document.createElement("td");
            cella.className = index === 0 ? "px-6 py-4 font-medium text-gray-900 whitespace-nowrap" : "px-6 py-4";
            cella.textContent = adat;
            sor.appendChild(cella);
        });

        const allapotCella = document.createElement("td");
        allapotCella.className = `p-4 ${konyv.kolcsonozve ? "text-red-600" : "text-green-600"}`;
        allapotCella.textContent = konyv.kolcsonozve ? "Kölcsönözve" : "Kölcsönözhető";
        sor.appendChild(allapotCella);

        const muveletCella = document.createElement("td");
        muveletCella.className = "p-4";

        const gomb = document.createElement("button");
        gomb.className = "font-medium text-emerald-800 hover:underline cursor-pointer mr-4";
        gomb.textContent = konyv.kolcsonozve ? "Visszahozás" : "Kölcsönzés";
        gomb.onclick = () => {
            konyv.kolcsonozve ? konyv.visszahoz() : konyv.kolcsonoz();
            konyvHibaUzenet.textContent = "";
            konyvekMegjelenitese();
        };
        muveletCella.appendChild(gomb);

        const torlesGomb = document.createElement("button");
        torlesGomb.className = "font-medium text-red-700 hover:underline cursor-pointer";
        torlesGomb.textContent = "Törlés";
        torlesGomb.onclick = () => {
            const index = konyvek.indexOf(konyv);
            if (index !== -1) konyvek.splice(index, 1);
            konyvekMegjelenitese();
        };
        muveletCella.appendChild(torlesGomb);

        sor.appendChild(muveletCella);
        konyvTablazatMegjelenites.appendChild(sor);
    });
}

function konyvMent(event) {
    event.preventDefault();
    try {
        const cim = document.getElementById("cim").value.trim();
        const szerzo = document.getElementById("szerzo").value.trim();
        const kiadasiEv = document.getElementById("kiadasiev").valueAsNumber;
        const oldalszam = document.getElementById("oldalszam").valueAsNumber;
        const kategoria = document.getElementById("kategoria").value;

        if (!cim || !szerzo || isNaN(kiadasiEv) || kiadasiEv < 1 || isNaN(oldalszam) || oldalszam < 1) {
            throw new Error("Minden mezőt megfelelően ki kell tölteni.");
        }

        konyvek.push(new Konyv(cim, szerzo, kiadasiEv, oldalszam, kategoria));
        konyvHibaUzenet.textContent = "";
        document.getElementById("konyvForm").reset();
        konyvEredmeny.textContent = "";
        konyvekMegjelenitese();
    } catch (hiba) {
        konyvHibaUzenet.textContent = `Hiba: ${hiba.message}`;
    }
}

function osszesKonyv() {
    aktualisNezet = "osszes";
    kivalasztottKategoria = "Mind";
    document.getElementById("kategoriaSzuro").value = "Mind";
    konyvEredmeny.textContent = "";
    konyvekMegjelenitese();
}

function szabadKonyvek() {
    aktualisNezet = "szabad";
    konyvEredmeny.textContent = "";
    konyvekMegjelenitese();
}

function kategoriaSzerintiSzures(kategoria) {
    kivalasztottKategoria = kategoria;
    aktualisNezet = "osszes";
    konyvEredmeny.textContent = "";
    konyvekMegjelenitese();
}

function kategoriaSzurtLista() {
    return kivalasztottKategoria === "Mind" ? konyvek : konyvek.filter(k => k.kategoria === kivalasztottKategoria);
}

function aktualisLista() {
    const lista = kategoriaSzurtLista();
    if (lista.length === 0) return [];

    if (aktualisNezet === "szabad") return lista.filter(k => !k.kolcsonozve);
    if (aktualisNezet === "legregebbi") return [lista.reduce((l, k) => k.kiadasiEv < l.kiadasiEv ? k : l)];
    if (aktualisNezet === "legvastagabb") return [lista.reduce((l, k) => k.oldalszam > l.oldalszam ? k : l)];
    return lista;
}

function legregebbiKonyv() {
    aktualisNezet = "legregebbi";
    konyvEredmeny.textContent = kategoriaSzurtLista().length === 0 ? "Nincs könyv a kategóriában." : "";
    konyvekMegjelenitese();
}

function legvastagabbKonyv() {
    aktualisNezet = "legvastagabb";
    konyvEredmeny.textContent = kategoriaSzurtLista().length === 0 ? "Nincs könyv a kategóriában." : "";
    konyvekMegjelenitese();
}

function atlagosOldalszam() {
    if (konyvek.length === 0) {
        konyvEredmeny.textContent = "Nincs könyv, az átlag nem számítható ki.";
        return;
    }
    const atlag = konyvek.reduce((osszeg, k) => osszeg + k.oldalszam, 0) / konyvek.length;
    konyvEredmeny.textContent = `Átlagos oldalszám: ${Number.isInteger(atlag) ? atlag : atlag.toFixed(1).replace(".", ",")} oldal`;
}
