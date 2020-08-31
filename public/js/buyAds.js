function calculate(e) {
    e.preventDefault();
    var ft = document.getElementById('f')
    var uft = document.getElementById('uf')
    var qty = document.getElementById('qty').value;
    var priceField = document.getElementById('price');
    console.log(qty)
    console.log(ft.checked, uft.checked)
    var final;
    (ft.checked ? (final = qty * 20) : (final = qty * 10));
    priceField.innerText = "Total:- " + final;
}