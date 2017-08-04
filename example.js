const Connection = require('./index')

const config = {
  user: 'operador',
  password: 'ra3800',
  database: 'consultas',
  port: 6432,
  host: '172.16.10.99'
}

Connection.config(config)

const select = async () => {
  try {
    await Connection.open(config)
    // await Connection.beginTransaction()
    let empresas = await Connection.query(`SELECT
        id_empresa,
        cpf_cnpj,
        telefone,
        contato,
        contato_email,
        contato_telefone,
        contato_cpf_cnpj,
        codg_municipio,
        uf
      from
        ncm_helper.cad_empresas limit 10`,
      [],
      {
        idEmpresa: 'id',
        cpfCnpj: 'cnpj',
        telefone: 'tel',
        contato: {
          contato: 'nome',
          contatoEmail: 'email',
          contatoTelefone: 'telefone',
          contatoCpfCnpj: 'cpf'
        },
        endereco: {
          municipio: {
            codgMunicipio: 'codgIbge',
            estado: {
              uf: ''
            }
          }
        }
      }
    )
    // await Connection.commit()
    // for(let i in empresas) {
    //   empresas[i].unidadesConsumidoras = await Connection.query(`SELECT
    //     *
    //   from
    //     ncm_helper.cad_empresas_uc where id_empresa = $1`,
    //     [empresas[i].id],
    //     {}
    //   )
    // }
    console.log(empresas[0])
    // console.log(JSON.stringify(empresas))
  } catch (e) {
    await Connection.rollback()
    console.error({ message: e.message, error: e.stack })
  } finally {
    await Connection.close()
  }
}

select()
