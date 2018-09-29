module AppHelper

  def create_app_from_manifest(config)
    app = get_or_create_app(config)

    (config[:stages] || []).each do |stage|
      stage_uid = get_or_create_stage(app, stage)
      (stage[:clusters] || []).each do |cluster|
        get_or_create_cluster(app, stage_uid, cluster)
      end
    end
  end

  def get_app_manifest(uid)
    manifest = {}
    app = App.find_by_uid!(uid)
    manifest[:name] = app.name
    manifest[:id] = app.uid

    manifest[:stages] = app.stages.map do |stage|
      stage_map = stage.slice(:name, :review, :auto, :promotion)
      stage_map[:clusters] = stage.clusters.map do |cluster|
        cluster.slice(:name, :values)
      end
      stage_map
    end

    manifest
  end

  def get_or_create_app(app_config)
    app_uid = App.find_by_name(app_config[:name]).try(:uid)
    Apps::UpsertCommand.execute(app_config.merge(
      app_uid: app_uid,
    ))

    App.find_by_name!(app_config[:name])
  end

  def get_or_create_stage(app, stage_config)
    stage_uid = Stage.find_by_name(stage_config[:name]).try(:uid)
    Apps::UpsertStageCommand.execute(stage_config.merge(
      stage_uid: stage_uid,
      app_uid:  app.uid
    ))

    Stage.find_by!(app: app, name: stage_config[:name]).uid
  end

  def get_or_create_cluster(app, stage_uid, cluster_config)
    cluster_uid = Cluster.find_by_name(cluster_config[:name]).try(:uid)
    Apps::UpsertClusterCommand.execute(cluster_config.merge(
      cluster_uid: cluster_uid,
      stage_uid:   stage_uid,
      app_uid:     app.uid
    ))

    Cluster.find_by!(app: app, name: cluster_config[:name]).uid
  end

end
