<div class="campos">
     <div class="campo">
     	<label for="nombre">Nombre: </label>
		<input type="text" name="" id="nombre" placeholder="Nombre Contacto" value="<?php echo (isset($contacto["nombre"])) ? $contacto["nombre"] : '';?>">
	</div>
	<div class="campo">
		<label for="empresa">Empresa: </label>
		<input type="text" name="" id="empresa" placeholder="Nombre Empresa" value="<?php echo (isset($contacto["empresa"])) ? $contacto["empresa"] : '';?>">
	</div>
	<div class="campo"> 
		<label for="telefono">Telefono: </label>
		<input type="tel" name="" id="telefono" placeholder="Tefefono" value="<?php echo (isset($contacto["telefono"])) ? $contacto["telefono"] : '';?>">
	</div>


</div>
<div class="enviar campo">
	<?php
		$textoBtn = (isset($contacto["telefono"])) ? 'Guardar': 'Añadir';

		$accion =  (isset($contacto["telefono"])) ? 'editar': 'crear';
	?>
	<input type="hidden" id="accion" value="<?php echo $accion;?>">

	<?php if(isset($contacto["id"])){?>

	<input type="hidden" id="id" value="<?php echo $contacto["id"];?>">
		
	<?php }?>

	<input type="submit" value="<?php echo $textoBtn;?>">
</div>