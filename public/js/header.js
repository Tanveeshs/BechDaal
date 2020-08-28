//DONE
var state_arr = new Array("Mumbai");
var s_a = new Array();
s_a[0]="";
s_a[1]="Andheri(E)|Andheri(W)|Bandra(E)|Bandra(W)|Bhandup|Borivali(E)|Borivali(W)|Breach Candy|Byculla|Colaba|Cuffe Parade|Chembur|Churchgate|Charni Road|Dadar(E)|Dadar(W)|Dahisar|Dharavi|Deonar|Dongri|Elphinstone Road|Flora Fountain|Fort|Girgaum|Grant Road|Goregaon(E)|Goregaon(W)|Ghatkopar(E)|Ghatkopar(W)|Jogeshwari(E)|Jogeshwari(W)|Juhu|Kalbadevi|Kandivali(E)|Kandivali(W)|Khar(E)|Khar(W)|King's Circle|Kurla(E)|Kurla(W)|Lower Parel|Mazgaon|Mahim|Malabar Hill|Matunga|Marine Lines|Malad(E)|Malad(W)|Mulund(E)|Mulund(W)|Nariman Point|Parel|Prabhadevi|Peddar Road|Saki Naka|Santacruz(E)|Santacruz(W)|Sion|Tardeo|Trombay|Versova|Vile Parle(E)|Vile Parle(W)|Vidya Vihar|Vikhroli|Wadala|Worli";
function print_state(state_id){
    var option_str = document.getElementById(state_id);
    option_str.length=0;
    option_str.options[0] = new Option('Select City','');
    option_str.selectedIndex = 0;
    for (var i=0; i<state_arr.length; i++) {
        option_str.options[option_str.length] = new Option(state_arr[i],state_arr[i]);
    }
}
function print_city(city_id, city_index){
    var option_str = document.getElementById(city_id);
    option_str.length=0;
    option_str.options[0] = new Option('Select Area','');
    option_str.selectedIndex = 0;
    var city_arr = s_a[city_index].split("|");
    for (var i=0; i<city_arr.length; i++) {
        option_str.options[option_str.length] = new Option(city_arr[i],city_arr[i]);
    }
}

print_state("sts");