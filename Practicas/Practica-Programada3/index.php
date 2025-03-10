<?php
$transacciones = json_decode(file_get_contents('transacciones.txt'), true) ?? [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['registrar'])) {
        $descripcion = $_POST['descripcion'];
        $monto = $_POST['monto'];

        registrarTransaccion(count($transacciones) + 1, $descripcion, $monto);
    } elseif (isset($_POST['generar'])) {
        generarEstadoDeCuenta();
    }
}

function registrarTransaccion($id, $descripcion, $monto){
    global $transacciones;

    $transacciones[] = [
        'id' => $id,
        'descripcion' => $descripcion,
        'monto' => $monto
    ];

    $resultado = file_put_contents('transacciones.txt', json_encode($transacciones, JSON_PRETTY_PRINT));

}

function generarEstadoDeCuenta(){
    global $totalConInteres;
    global $cashBack;
    global $montoFinal;

    //global $transacciones;
    $transacciones = json_decode(file_get_contents('transacciones.txt'), true) ?? [];

    global $totalContado;

    foreach ($transacciones as $transaccion) {
        $totalContado += $transaccion['monto'];
    }

    $totalConInteres = $totalContado * 1.026;
    $cashBack = $totalContado * 0.001;
    $montoFinal = $totalConInteres - $cashBack;

}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tarea  3</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
</head>
<body>
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="formularioTransaccion" >
                    <h2>Registrar Transacción</h2>
                    <form action="index.php" method="POST">
                        <div class="mb-3">
                            <label for="descripcion" class="form-label">Descripción</label>
                            <input type="text" class="form-control" id="descripcion" name="descripcion">
                        </div>
                        <div class="mb-3">
                            <label for="monto" class="form-label">Monto</label>
                            <input type="text" class="form-control" id="monto" name="monto">
                        </div>
                        <button type="submit" class="btn btn-primary" name="registrar">Registrar Transaccción</button>
                        <button type="submit" class="btn btn-warning" name="generar">Generar Estado de Cuenta</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="row mt-4">
            <div class="estadoCuenta">
               <h1>Estado de Cuenta</h1>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Descripción</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php 
                        foreach ($transacciones as $transaccion) {?>
                            <tr>
                            <td><?php echo $transaccion['id']; ?></td>
                            <td><?php echo $transaccion['descripcion']; ?></td>
                            <td><?php echo $transaccion['monto']; ?></td>
                        </tr>
                        <?php }?>
                    </tbody>
                </table> 
            </div> 
            <div>
                <p>Monto Total de Contado: <strong> <?php echo $totalContado; ?> </strong></p>
                <p>Monto Total con Interés (2.6%): <strong> <?php echo $totalConInteres; ?></strong></p>
                <p>Cash Back (0.1%): <strong> <?php echo $cashBack; ?></strong></p>
                <p>Monto Final a Pagar: <strong> <?php echo $montoFinal; ?></strong></p>
            </div>
        </div>
    </div>
    
</body>
</html>